import ts from 'typescript';
import type { UmiPluginNProgressConfig } from './interfaces';
import { Translations } from './locales';

export interface CreateRuntimeProgramOptions extends UmiPluginNProgressConfig {
  runtimeAPISource: string;
}

export function createRuntimeProgram(options: CreateRuntimeProgramOptions): ts.SourceFile {
  const { runtime, runtimeAPISource, ui } = options;

  return ts.factory.createSourceFile(
    [
      createImportDeclaration(runtimeAPISource, ['NProgress', 'setupNProgressPluginRuntime']),
      createPlainCallExpression(createElementAccessExpressions('NProgress', ['configure']), [
        createLiteral(ui),
      ]),
      createPlainCallExpression(createElementAccessExpressions('setupNProgressPluginRuntime'), [
        createLiteral(runtime),
      ]),
    ],
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  );
}

export function printSourceFile(sourceFile: ts.SourceFile): string {
  return ts.createPrinter().printFile(sourceFile);
}

function createImportDeclaration(
  moduleName: string,
  specifiers?: readonly (string | readonly [string, string])[],
  defaultSpecifier?: string,
  isTypeOnly?: boolean,
): ts.ImportDeclaration {
  const moduleSpecifierNode = ts.factory.createStringLiteral(moduleName);
  const defaultSpecifierNode = defaultSpecifier
    ? ts.factory.createIdentifier(defaultSpecifier)
    : undefined;
  const importSpecifierNodes = specifiers?.map((specifier) => {
    return typeof specifier === 'string'
      ? ts.factory.createImportSpecifier(undefined, ts.factory.createIdentifier(specifier))
      : ts.factory.createImportSpecifier(
          ts.factory.createIdentifier(specifier[0]),
          ts.factory.createIdentifier(specifier[1]),
        );
  });
  const namedImportsNode =
    importSpecifierNodes && ts.factory.createNamedImports(importSpecifierNodes);

  const importClause =
    defaultSpecifierNode || namedImportsNode
      ? ts.factory.createImportClause(isTypeOnly || false, defaultSpecifierNode, namedImportsNode)
      : undefined;
  return ts.factory.createImportDeclaration(
    undefined,
    undefined,
    importClause,
    moduleSpecifierNode,
  );
}

function createPlainCallExpression(
  callee: ts.Expression,
  argumentsArray?: readonly ts.Expression[],
  typeArguments?: readonly ts.TypeNode[],
): ts.ExpressionStatement {
  const expression = ts.factory.createCallExpression(callee, typeArguments, argumentsArray);
  return ts.factory.createExpressionStatement(expression);
}

function createElementAccessExpressions(
  target: string | ts.Expression,
  elements?: readonly unknown[],
): ts.Expression {
  const expression = typeof target === 'string' ? ts.factory.createIdentifier(target) : target;
  if (!elements?.length) return expression;
  return createElementAccessExpressions(
    ts.factory.createElementAccessExpression(expression, createLiteral(elements[0])),
    elements.slice(1),
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types
function createObjectExpressionFromPlainObject(object: object): ts.ObjectLiteralExpression {
  const properties = Object.getOwnPropertyNames(object).map((name) => {
    const value = (object as Record<string, unknown>)[name];
    const propertyName = /^[_$a-z][_$a-z0-9]*$/i.test(name)
      ? name
      : ts.factory.createComputedPropertyName(createLiteral(name));
    return ts.factory.createPropertyAssignment(propertyName, createLiteral(value));
  });

  return ts.factory.createObjectLiteralExpression(properties, true);
}

function createLiteral(
  value: unknown,
):
  | ts.BigIntLiteral
  | ts.FalseLiteral
  | ts.Identifier
  | ts.NullLiteral
  | ts.NumericLiteral
  | ts.ObjectLiteralExpression
  | ts.StringLiteral
  | ts.TrueLiteral {
  switch (typeof value) {
    case 'bigint':
      return ts.factory.createBigIntLiteral(String(value).concat('n'));
    case 'boolean':
      return value ? ts.factory.createTrue() : ts.factory.createFalse();
    case 'number':
      return ts.factory.createNumericLiteral(value);
    case 'string':
      return ts.factory.createStringLiteral(value, true);
    case 'undefined':
      return ts.factory.createIdentifier('undefined');
    case 'object':
      return value === null
        ? ts.factory.createNull()
        : createObjectExpressionFromPlainObject(value);
  }

  throw new Error(Translations.CreateTSLiteralUnsupportedValueError(typeof value));
}
