const fs = require('node:fs');
const path = require('node:path');
const { performance } = require('node:perf_hooks');
const { spawn } = require('node:child_process');
const ts = require('typescript');

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, 'benchmarks', 'results', 'project');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'project-metrics.json');

const FRAMEWORKS = {
  react: {
    label: 'React',
    buildCommand: ['pnpm', ['--filter', '@sortify/react', 'build']],
    buildOutputPath: path.join(ROOT_DIR, 'apps', 'react', 'build'),
    sourcePath: path.join(ROOT_DIR, 'apps', 'react', 'src'),
    packageJsonPath: path.join(ROOT_DIR, 'apps', 'react', 'package.json'),
    cleanPaths: [path.join(ROOT_DIR, 'apps', 'react', 'build')],
    sourceExtensions: ['.ts', '.tsx', '.css'],
  },
  angular: {
    label: 'Angular',
    buildCommand: ['pnpm', ['--filter', '@sortify/angular', 'build']],
    buildOutputPath: path.join(ROOT_DIR, 'apps', 'angular', 'dist'),
    sourcePath: path.join(ROOT_DIR, 'apps', 'angular', 'src'),
    packageJsonPath: path.join(ROOT_DIR, 'apps', 'angular', 'package.json'),
    cleanPaths: [
      path.join(ROOT_DIR, 'apps', 'angular', 'dist'),
      path.join(ROOT_DIR, 'apps', 'angular', '.angular'),
    ],
    sourceExtensions: ['.ts', '.html', '.scss', '.css'],
  },
};

function removePath(targetPath) {
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const startedAt = performance.now();
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
        return;
      }

      resolve(performance.now() - startedAt);
    });
  });
}

function walkDirectory(rootPath) {
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const entries = [];
  const queue = [rootPath];

  while (queue.length) {
    const currentPath = queue.pop();
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      for (const childName of fs.readdirSync(currentPath)) {
        queue.push(path.join(currentPath, childName));
      }
      continue;
    }

    entries.push({ path: currentPath, size: stats.size });
  }

  return entries;
}

function countSourceLines(content) {
  return content.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
}

function getComplexityFileExtensions(frameworkConfig) {
  return frameworkConfig.sourceExtensions.filter((extension) => extension === '.ts' || extension === '.tsx');
}

function isFunctionLikeNode(node) {
  return ts.isFunctionDeclaration(node)
    || ts.isMethodDeclaration(node)
    || ts.isArrowFunction(node)
    || ts.isFunctionExpression(node)
    || ts.isConstructorDeclaration(node)
    || ts.isGetAccessorDeclaration(node)
    || ts.isSetAccessorDeclaration(node);
}

function getFunctionName(node, sourceFile) {
  if (node.name && ts.isIdentifier(node.name)) {
    return node.name.text;
  }

  const parent = node.parent;

  if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
    return parent.name.text;
  }

  if (ts.isPropertyAssignment(parent) && ts.isIdentifier(parent.name)) {
    return parent.name.text;
  }

  if (ts.isBinaryExpression(parent) && ts.isIdentifier(parent.left)) {
    return parent.left.text;
  }

  return `anonymous@${sourceFile.getLineAndCharacterOfPosition(node.pos).line + 1}`;
}

function createFunctionContext(name, sourceFile, node) {
  const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;

  return {
    name,
    line,
    cyclomatic: 1,
    cognitive: 0,
  };
}

function addDecisionComplexity(context, nesting) {
  context.cyclomatic += 1;
  context.cognitive += 1 + nesting;
}

function analyzeFunctionNode(node, sourceFile) {
  const context = createFunctionContext(getFunctionName(node, sourceFile), sourceFile, node);

  function visit(currentNode, nesting) {
    if (currentNode !== node && isFunctionLikeNode(currentNode)) {
      return;
    }

    if (ts.isIfStatement(currentNode)) {
      addDecisionComplexity(context, nesting);
      visit(currentNode.expression, nesting);
      visit(currentNode.thenStatement, nesting + 1);
      if (currentNode.elseStatement) {
        visit(currentNode.elseStatement, ts.isIfStatement(currentNode.elseStatement) ? nesting : nesting + 1);
      }
      return;
    }

    if (
      ts.isForStatement(currentNode)
      || ts.isForInStatement(currentNode)
      || ts.isForOfStatement(currentNode)
      || ts.isWhileStatement(currentNode)
      || ts.isDoStatement(currentNode)
      || ts.isCatchClause(currentNode)
      || ts.isConditionalExpression(currentNode)
    ) {
      addDecisionComplexity(context, nesting);
    }

    if (ts.isCaseClause(currentNode)) {
      context.cyclomatic += 1;
      context.cognitive += 1 + nesting;
    }

    if (ts.isBinaryExpression(currentNode)) {
      const operator = currentNode.operatorToken.kind;
      if (
        operator === ts.SyntaxKind.AmpersandAmpersandToken
        || operator === ts.SyntaxKind.BarBarToken
        || operator === ts.SyntaxKind.QuestionQuestionToken
      ) {
        context.cyclomatic += 1;
        context.cognitive += 1 + nesting;
      }
    }

    ts.forEachChild(currentNode, (child) => {
      const nextNesting =
        ts.isIfStatement(currentNode)
        || ts.isForStatement(currentNode)
        || ts.isForInStatement(currentNode)
        || ts.isForOfStatement(currentNode)
        || ts.isWhileStatement(currentNode)
        || ts.isDoStatement(currentNode)
        || ts.isCatchClause(currentNode)
        || ts.isConditionalExpression(currentNode)
        || ts.isCaseClause(currentNode)
          ? nesting + 1
          : nesting;

      visit(child, nextNesting);
    });
  }

  visit(node, 0);

  return context;
}

function summarizeNumberSeries(values) {
  if (!values.length) {
    return {
      mean: null,
      max: null,
      total: 0,
    };
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    mean: total / values.length,
    max: Math.max(...values),
    total,
  };
}

function collectComplexityMetrics(frameworkConfig) {
  const sourceExtensions = getComplexityFileExtensions(frameworkConfig);
  const files = walkDirectory(frameworkConfig.sourcePath).filter((entry) => {
    const extension = path.extname(entry.path).toLowerCase();
    return sourceExtensions.includes(extension) && !entry.path.endsWith('.spec.ts');
  });

  const functions = [];
  const fileSummaries = [];

  for (const entry of files) {
    const content = fs.readFileSync(entry.path, 'utf8');
    const sourceFile = ts.createSourceFile(entry.path, content, ts.ScriptTarget.Latest, true, entry.path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const fileFunctions = [];

    const walk = (node) => {
      if (isFunctionLikeNode(node)) {
        const functionMetrics = analyzeFunctionNode(node, sourceFile);
        const normalized = {
          ...functionMetrics,
          path: path.relative(ROOT_DIR, entry.path),
        };
        functions.push(normalized);
        fileFunctions.push(normalized);
      }

      ts.forEachChild(node, walk);
    };

    walk(sourceFile);

    const cyclomaticSummary = summarizeNumberSeries(fileFunctions.map((item) => item.cyclomatic));
    const cognitiveSummary = summarizeNumberSeries(fileFunctions.map((item) => item.cognitive));

    fileSummaries.push({
      path: path.relative(ROOT_DIR, entry.path),
      functionCount: fileFunctions.length,
      cyclomaticTotal: cyclomaticSummary.total,
      cognitiveTotal: cognitiveSummary.total,
      maxCyclomatic: cyclomaticSummary.max,
      maxCognitive: cognitiveSummary.max,
    });
  }

  const cyclomaticSummary = summarizeNumberSeries(functions.map((item) => item.cyclomatic));
  const cognitiveSummary = summarizeNumberSeries(functions.map((item) => item.cognitive));
  const topCyclomatic = [...functions]
    .sort((left, right) => right.cyclomatic - left.cyclomatic)
    .slice(0, 10);
  const topCognitive = [...functions]
    .sort((left, right) => right.cognitive - left.cognitive)
    .slice(0, 10);

  return {
    analyzedFileCount: files.length,
    functionCount: functions.length,
    cyclomatic: {
      mean: cyclomaticSummary.mean,
      max: cyclomaticSummary.max,
      total: cyclomaticSummary.total,
    },
    cognitive: {
      mean: cognitiveSummary.mean,
      max: cognitiveSummary.max,
      total: cognitiveSummary.total,
    },
    topCyclomatic,
    topCognitive,
    topFiles: fileSummaries
      .sort((left, right) => right.cognitiveTotal - left.cognitiveTotal)
      .slice(0, 10),
  };
}

function collectSourceMetrics(frameworkConfig) {
  const sourceExtensions = frameworkConfig.sourceExtensions.map((extension) => extension.toLowerCase());
  const files = walkDirectory(frameworkConfig.sourcePath).filter((entry) =>
    sourceExtensions.includes(path.extname(entry.path).toLowerCase()),
  );
  const fileLineMetrics = files.map((entry) => {
    const content = fs.readFileSync(entry.path, 'utf8');
    return {
      path: path.relative(ROOT_DIR, entry.path),
      lines: countSourceLines(content),
    };
  });
  const totalLines = fileLineMetrics.reduce((sum, entry) => sum + entry.lines, 0);
  const largestFile = fileLineMetrics.reduce(
    (largest, entry) => (entry.lines > (largest?.lines ?? -1) ? entry : largest),
    null,
  );

  return {
    fileCount: files.length,
    lineCount: totalLines,
    averageLinesPerFile: files.length ? totalLines / files.length : null,
    largestFile,
  };
}

function collectArtifactMetrics(buildOutputPath) {
  const files = walkDirectory(buildOutputPath);
  const jsFiles = files.filter((entry) => entry.path.endsWith('.js'));
  const largestJsFile = jsFiles.reduce(
    (largest, entry) => (entry.size > (largest?.size ?? -1) ? entry : largest),
    null,
  );

  return {
    totalSizeBytes: files.reduce((sum, entry) => sum + entry.size, 0),
    fileCount: files.length,
    jsAssetCount: jsFiles.length,
    largestJsFile: largestJsFile
      ? {
          path: path.relative(ROOT_DIR, largestJsFile.path),
          sizeBytes: largestJsFile.size,
        }
      : null,
  };
}

function collectDependencyMetrics(packageJsonPath) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  return {
    directCount: Object.keys(packageJson.dependencies ?? {}).length,
    devCount: Object.keys(packageJson.devDependencies ?? {}).length,
  };
}

async function collectFrameworkMetrics(frameworkKey, frameworkConfig) {
  for (const targetPath of frameworkConfig.cleanPaths) {
    removePath(targetPath);
  }

  const [command, args] = frameworkConfig.buildCommand;
  const coldBuildMs = await runCommand(command, args);
  const warmBuildMs = await runCommand(command, args);

  return {
    key: frameworkKey,
    label: frameworkConfig.label,
    build: {
      coldMs: coldBuildMs,
      warmMs: warmBuildMs,
    },
    artifacts: collectArtifactMetrics(frameworkConfig.buildOutputPath),
    source: collectSourceMetrics(frameworkConfig),
    complexity: collectComplexityMetrics(frameworkConfig),
    dependencies: collectDependencyMetrics(frameworkConfig.packageJsonPath),
  };
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const frameworks = {};

  for (const [frameworkKey, frameworkConfig] of Object.entries(FRAMEWORKS)) {
    frameworks[frameworkKey] = await collectFrameworkMetrics(frameworkKey, frameworkConfig);
  }

  const result = {
    generatedAt: new Date().toISOString(),
    frameworks,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
  console.log(`Saved project metrics to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});