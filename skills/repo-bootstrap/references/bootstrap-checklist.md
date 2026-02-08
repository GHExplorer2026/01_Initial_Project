# Repository Bootstrap Checklist

## 1. Repo Foundation
- [ ] Decide repo model (single package or monorepo)
- [ ] Create `src/`, `tests/`, `docs/` (and optional `scripts/`)
- [ ] Add `README.md` with setup/run/test instructions
- [ ] Add `LICENSE`
- [ ] Add `.gitignore`
- [ ] Add `.env.example` (if env vars are used)

## 2. Team Conventions
- [ ] Define branch strategy
- [ ] Define commit message convention
- [ ] Define PR review expectations
- [ ] Add issue template
- [ ] Add PR template

## 3. Quality Gates
- [ ] Configure formatter
- [ ] Configure linter
- [ ] Configure test runner
- [ ] Configure coverage threshold
- [ ] Configure pre-commit or pre-push checks

## 4. CI Pipeline
- [ ] Install dependencies step
- [ ] Lint step
- [ ] Test step
- [ ] Build step
- [ ] Cache strategy
- [ ] Fail-fast on quality checks

## 5. Dependency Hygiene
- [ ] Lock dependency versions
- [ ] Add dependency audit command
- [ ] Define update cadence
- [ ] Document supported runtime versions

## 6. Ownership and Operations
- [ ] Add CODEOWNERS or ownership note
- [ ] Document release process
- [ ] Document incident/escalation contact

