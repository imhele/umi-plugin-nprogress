import ts from 'typescript';
import {
  createImportDeclaration,
  createLiteral,
  createObjectExpressionFromPlainObject,
} from './runtime';

describe('function createImportDeclaration()', () => {
  it('should exist', () => {
    expect(createImportDeclaration).toEqual(expect.any(Function));
  });

  it('should import nothing if module name provided only', () => {
    const moduleName = 'hello';
    const declaration = createImportDeclaration(moduleName);
    expect(ts.isImportDeclaration(declaration)).toBeTruthy();
    expect(declaration.importClause).toBeUndefined();
    expect(
      ts.isStringLiteral(declaration.moduleSpecifier) && declaration.moduleSpecifier.text,
    ).toBe(moduleName);
  });

  it('should import default if specifier provided', () => {
    const moduleName = 'hello';
    const defaultSpecifier = 'func';
    const declaration = createImportDeclaration(moduleName, undefined, defaultSpecifier);
    expect(declaration.importClause?.name?.text).toBe(defaultSpecifier);
  });

  it('should import type only if enabled', () => {
    const moduleName = 'hello';
    const defaultSpecifier = 'func';
    const declaration = createImportDeclaration(moduleName, undefined, defaultSpecifier, true);
    expect(declaration.importClause?.isTypeOnly).toBeTruthy();
  });

  it('should import contents if name bindings provided', () => {
    const moduleName = 'hello';
    const specifiers = ['a', ['b', 'c']] as const;
    const declaration = createImportDeclaration(moduleName, specifiers, undefined, true);
    expect(
      declaration.importClause?.namedBindings &&
        ts.isNamedImports(declaration.importClause.namedBindings) &&
        declaration.importClause.namedBindings.elements.map(({ name, propertyName: prop }) =>
          prop ? ([prop.text, name.text] as const) : name.text,
        ),
    ).toEqual(specifiers);
  });
});

describe('function createLiteral()', () => {
  it('should exist', () => {
    expect(createLiteral).toEqual(expect.any(Function));
  });

  it('should create literal for primitives', () => {
    expect(ts.isBigIntLiteral(createLiteral(1n))).toBeTruthy();
    expect(createLiteral(true).kind).toBe(ts.SyntaxKind.TrueKeyword);
    expect(createLiteral(false).kind).toBe(ts.SyntaxKind.FalseKeyword);
    expect(ts.isNumericLiteral(createLiteral(1))).toBeTruthy();
    expect(ts.isStringLiteral(createLiteral(''))).toBeTruthy();
    expect(ts.isIdentifier(createLiteral(undefined))).toBeTruthy();
    expect(createLiteral(null).kind).toBe(ts.SyntaxKind.NullKeyword);
  });

  it('should throw for unsupported value', () => {
    expect(() => createLiteral(Symbol())).toThrow();
  });
});

describe('function createObjectExpressionFromPlainObject()', () => {
  it('should exist', () => {
    expect(createObjectExpressionFromPlainObject).toEqual(expect.any(Function));
  });

  it('should create object expression for plain object', () => {
    const [key, value] = ['hello', 'world'];
    const object = createObjectExpressionFromPlainObject({ [key]: value });
    expect(ts.isObjectLiteralExpression(object)).toBeTruthy();
    expect(object.properties.length).toBe(1);

    const property = object.properties[0] as Required<ts.ObjectLiteralElementLike>;
    expect(ts.isIdentifier(property.name) && property.name.text).toBe(key);
    expect(
      ts.isPropertyAssignment(property) &&
        ts.isStringLiteral(property.initializer) &&
        property.initializer.text,
    ).toBe(value);
  });

  it('should create object expression for plain object with computed property name', () => {
    const [key, value] = ['-hello-', '-world-'];
    const object = createObjectExpressionFromPlainObject({ [key]: value });
    expect(ts.isObjectLiteralExpression(object)).toBeTruthy();
    expect(object.properties.length).toBe(1);

    const property = object.properties[0] as Required<ts.ObjectLiteralElementLike>;
    expect(
      ts.isComputedPropertyName(property.name) &&
        ts.isStringLiteral(property.name.expression) &&
        property.name.expression.text,
    ).toBe(key);
    expect(
      ts.isPropertyAssignment(property) &&
        ts.isStringLiteral(property.initializer) &&
        property.initializer.text,
    ).toBe(value);
  });
});
