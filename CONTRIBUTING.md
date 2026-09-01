# Contributing to InsightForge

Thank you for your interest in contributing to InsightForge! We welcome contributions from the community and are grateful for your support.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

**Expected Behavior:**
- Use welcoming and inclusive language
- Be respectful of differing opinions
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

**Unacceptable Behavior:**
- Harassment or discrimination
- Insulting or derogatory comments
- Personal attacks
- Trolling or inflammatory remarks
- Any form of abuse

---

## 🎯 How to Contribute

### Reporting Bugs

Before creating a bug report, please check the [issue list](https://github.com/animeaccession0-arch/InsightForge/issues) to avoid duplicates.

**When filing a bug report, include:**
- Clear descriptive title
- Detailed description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, etc.)
- Any relevant error messages or logs

### Suggesting Features

We welcome feature suggestions! Please:

1. Use a clear descriptive title
2. Provide detailed description of the feature
3. Explain why this feature would be useful
4. List examples of how it would work
5. Include any relevant references

### Documentation Improvements

Documentation is crucial! You can:
- Fix typos and grammar
- Clarify confusing sections
- Add missing examples
- Improve organization
- Translate documentation

---

## 🔧 Development Setup

### Prerequisites
- Node.js 18.x or higher
- pnpm 10.x or higher
- Git

### Setup Steps

```bash
# 1. Fork the repository
# Visit: https://github.com/animeaccession0-arch/InsightForge/fork

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/InsightForge.git
cd InsightForge

# 3. Add upstream remote
git remote add upstream https://github.com/animeaccession0-arch/InsightForge.git

# 4. Install dependencies
pnpm install

# 5. Create a feature branch
git checkout -b feature/your-feature-name

# 6. Start development server
pnpm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_OAUTH_PORTAL_URL=http://localhost:3000
VITE_APP_ID=dev-app-id
NODE_ENV=development
```

---

## 📁 Project Structure

```
InsightForge/
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   ├── pages/         # Page components
│   │   ├── _core/         # Core logic
│   │   ├── App.tsx        # Root component
│   │   ├── main.tsx       # Entry point
│   │   ├── const.ts       # Constants
│   │   └── index.css      # Styles
│   └── public/            # Static files
├── server/                # Backend code
├── shared/                # Shared utilities
├── drizzle/               # Database migrations
└── docs/                  # Documentation
```

---

## 💻 Coding Standards

### TypeScript

- ✅ Use strict mode
- ✅ Avoid `any` type
- ✅ Use proper interfaces/types
- ✅ Add JSDoc comments for public APIs

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Fetches a user by ID
 * @param id - The user ID
 * @returns The user object or null
 */
export async function getUser(id: string): Promise<User | null> {
  // implementation
}

// ❌ Avoid
function getUser(id: any): any {
  // implementation
}
```

### React Components

- ✅ Use functional components with hooks
- ✅ Use proper component typing
- ✅ Memoize expensive computations
- ✅ Extract complex logic to custom hooks

```typescript
// ✅ Good
import { FC, useMemo } from 'react';

interface UserCardProps {
  userId: string;
}

export const UserCard: FC<UserCardProps> = ({ userId }) => {
  const user = useFetchUser(userId);

  const displayName = useMemo(() => {
    return user?.name || 'Unknown User';
  }, [user?.name]);

  return <div>{displayName}</div>;
};

// ❌ Avoid
export function UserCard(props) {
  return <div>{props.user.name}</div>;
}
```

### CSS/Styling

- ✅ Use Tailwind CSS utilities
- ✅ Use CSS variables for theming
- ✅ Follow mobile-first approach
- ✅ Avoid inline styles

```typescript
// ✅ Good
<div className="bg-white dark:bg-slate-950 p-4 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Title</h1>
</div>

// ❌ Avoid
<div style={{ backgroundColor: 'white', padding: '16px' }}>
  <h1 style={{ fontSize: '24px' }}>Title</h1>
</div>
```

### Error Handling

- ✅ Always handle errors
- ✅ Use try-catch appropriately
- ✅ Log errors properly
- ✅ Provide user feedback

```typescript
// ✅ Good
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Failed to fetch data:', error);
  showErrorToast('Unable to load data. Please try again.');
}

// ❌ Avoid
const data = await fetchData();
setData(data);
```

---

## 📝 Commit Guidelines

We follow conventional commits for clear commit history.

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **ci:** CI/CD changes
- **chore:** Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add OAuth login flow"

# Bug fix
git commit -m "fix(const): handle missing OAuth config gracefully"

# Documentation
git commit -m "docs: update installation guide"

# Performance
git commit -m "perf(bundle): optimize code splitting"
```

### Commit Body Guidelines

- Explain what and why, not how
- Keep lines to 72 characters
- Reference issues: `Closes #123`
- Use imperative mood: "add" not "added"

```bash
git commit -m "feat(api): add user pagination

Add pagination support to user list endpoint to improve
performance with large datasets.

Changes:
- Add limit and offset query parameters
- Implement cursor-based pagination
- Add total count to response

Closes #456"
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests and checks**
   ```bash
   pnpm run check      # TypeScript check
   pnpm run format     # Format code
   pnpm run test       # Run tests
   pnpm run build      # Build for production
   ```

3. **Create focused commits**
   - Each commit should be logically independent
   - Use descriptive commit messages
   - Keep commits small and focused

### Submitting a PR

1. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request on GitHub
   - Use a clear, descriptive title
   - Fill out the PR template
   - Reference related issues
   - Add screenshots if applicable

3. PR Title Format
   ```
   [type]: Brief description (fixes #123)
   
   Example: feat: add dark mode toggle (fixes #789)
   ```

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Item 1
- Item 2
- Item 3

## Testing Done
Describe how you tested these changes

## Screenshots
Add screenshots if applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

### Review Process

- At least one review required
- All checks must pass
- Requested changes must be addressed
- Tests must pass before merging

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

### Writing Tests

Tests should be located next to the component/function being tested with `.test.ts` or `.test.tsx` suffix.

```typescript
// Example: userUtils.test.ts
import { describe, it, expect } from 'vitest';
import { formatUserName } from './userUtils';

describe('formatUserName', () => {
  it('should format user name correctly', () => {
    expect(formatUserName('john', 'doe')).toBe('John Doe');
  });

  it('should handle empty names', () => {
    expect(formatUserName('', '')).toBe('');
  });
});
```

### Test Coverage Requirements

- Aim for >80% coverage
- Focus on critical paths
- Test edge cases
- Mock external dependencies

---

## 📚 Documentation

### Code Comments

```typescript
/**
 * Validates and processes user input
 * @param input - Raw user input string
 * @returns Cleaned and validated input
 * @throws Error if input is invalid
 */
function processInput(input: string): string {
  // Implementation
}
```

### Documentation Files

Update relevant documentation when making changes:
- `README.md` - General information
- `docs/` - Detailed documentation
- `UPGRADE_SUMMARY.md` - For upgrade notes
- Inline code comments - For complex logic

### Updating README

If your changes affect:
- Installation process
- Configuration
- Available commands
- Features

Update `README.md` with the new information.

---

## 🚀 Release Process

We follow semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

Releases are managed by project maintainers.

---

## 📞 Getting Help

### Ask Questions

- GitHub Discussions: [InsightForge Discussions](https://github.com/animeaccession0-arch/InsightForge/discussions)
- Email: anime.accession0@gmail.com
- Open an issue with `question` label

### Documentation

- Check [README.md](./README.md)
- Review [UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md)
- Browse existing issues and PRs

---

## ✅ Contributor Checklist

Before submitting your contribution, verify:

- [ ] Code follows style guidelines
- [ ] Changes tested locally
- [ ] TypeScript checks pass (`pnpm run check`)
- [ ] Code formatted (`pnpm run format`)
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings/errors
- [ ] Commit messages follow guidelines
- [ ] PR description is clear
- [ ] Related issues are referenced

---

## 🎓 Learning Resources

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

### React
- [React Documentation](https://react.dev/)
- [React Hooks Guide](https://react.dev/reference/react)
- [React Best Practices](https://react.dev/learn)

### Vite
- [Vite Documentation](https://vitejs.dev/)
- [Vite Performance Guide](https://vitejs.dev/guide/ssr.html)

### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Utility-First CSS](https://tailwindcss.com/docs/utility-first)

---

## 🎉 Thank You!

Thank you for contributing to InsightForge! Your contributions help make this project better for everyone.

---

## 📋 Additional Resources

- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

<div align="center">

**Happy Contributing! 🚀**

For more information, visit the [GitHub Repository](https://github.com/animeaccession0-arch/InsightForge)

</div>
