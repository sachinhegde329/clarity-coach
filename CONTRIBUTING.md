# Contributing

This project uses a simple feature-branch workflow so changes stay easy to review and roll back.

## Branch flow

1. Start from `main`.
2. Create a feature branch with a clear name.
3. Make focused changes on that branch.
4. Commit in small, intentional steps.
5. Push the branch to GitHub.
6. Open a pull request into `main`.

## Suggested branch names

- `feature/<short-description>`
- `fix/<short-description>`
- `ui/<short-description>`
- `refactor/<short-description>`
- `chore/<short-description>`

## Suggested commit style

- `feat: add onboarding copy`
- `fix: handle empty state`
- `ui: tighten spacing on stats screen`
- `chore: update dependencies`

## Daily commands

```bash
git checkout main
git pull
git checkout -b feature/my-change
git add .
git commit -m "feat: describe the change"
git push -u origin feature/my-change
```

## Good habits

- Keep each branch to one task when possible.
- Avoid pushing directly to `main`.
- Open a PR even when working solo so changes stay easy to review.
- Pull from `main` before starting new work.
