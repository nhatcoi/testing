```markdown
# testing Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `testing` Java repository. It covers file organization, code style, import/export practices, and the approach to testing with Vitest. While no automated workflows were detected, this guide provides suggested commands and step-by-step instructions for common development tasks.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `myTestFile.java`

### Import Style
- Use **relative imports** for referencing other files or modules.
  - Example:
    ```java
    import mypackage.MyClass;
    ```

### Export Style
- Both default and named exports are used, depending on the context.
  - Example (default export):
    ```java
    public class MyClass { ... }
    ```
  - Example (named export):
    ```java
    public class MyClass { ... }
    public class AnotherClass { ... }
    ```

### Commit Message Patterns
- Freeform commit messages, sometimes prefixed (e.g., `restructure`).
- Average commit message length: 86 characters.
  - Example:  
    ```
    restructure: reorganize test utilities into separate helper files
    ```

## Workflows

### Running Tests
**Trigger:** When you want to verify code correctness.
**Command:** `/run-tests`

1. Ensure all code changes are saved.
2. Open your terminal in the project root.
3. Run the Vitest test suite:
    ```bash
    npx vitest
    ```
4. Review the output for passing and failing tests.

### Adding a New Test
**Trigger:** When adding new functionality or fixing a bug.
**Command:** `/add-test`

1. Create a new file following the `*.test.js` pattern.
    - Example: `myFeature.test.js`
2. Write test cases using Vitest syntax.
    - Example:
      ```js
      import { describe, it, expect } from 'vitest';
      import { myFunction } from './myFunction';

      describe('myFunction', () => {
        it('should return true for valid input', () => {
          expect(myFunction('valid')).toBe(true);
        });
      });
      ```
3. Run `/run-tests` to ensure your new test passes.

### Refactoring Code Structure
**Trigger:** When reorganizing files or modules for clarity.
**Command:** `/restructure`

1. Identify files or modules to be moved or renamed.
2. Apply camelCase naming to new files.
3. Update all relative imports to reflect changes.
4. Run `/run-tests` to verify nothing is broken.

## Testing Patterns

- **Framework:** [Vitest](https://vitest.dev/)
- **Test File Pattern:** Files end with `.test.js`
- **Test Structure:** Use `describe` and `it` blocks for organizing tests.
- **Example:**
  ```js
  import { describe, it, expect } from 'vitest';
  import { add } from './add';

  describe('add', () => {
    it('adds two numbers', () => {
      expect(add(1, 2)).toBe(3);
    });
  });
  ```

## Commands

| Command        | Purpose                                            |
|----------------|----------------------------------------------------|
| /run-tests     | Run all Vitest tests in the repository             |
| /add-test      | Add a new test file and write test cases           |
| /restructure   | Refactor or reorganize code and update imports     |
```