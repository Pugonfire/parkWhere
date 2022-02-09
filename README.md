# ParkWhere

### Starts backend

```
npm run dev
```

### Compiles and hot-reloads for development

```
cd client
npm run serve
```

### Formats all code

```
npm run format
```

## How to contribute to code

1. Navigate to directory parkWhere
2. git pull to update code

```
git pull
```

3. Checkout branch with appropriate name

- Code maintenance, refactoring: dev/... e.g. dev/prettier
- Adding feature: feat/... e.g. feat/googleLogin
- Fix a bug: bugfix/... e.g. bugfix/wrongDateTime

```
git checkout -b dev/prettier
```

4. Code!
5. Stage your files to commit

```
git add .
# to add all files
```

6. Commit files with a meaningful comment

```
git commit -m "made code pretty"
```

7. Push code

```
git push
# You'll be prompted with
# The current branch dev/prettier has no upstream branch.
# Copy and paste the git push --set-upstream ...
git push --set-upstream origin dev/prettier
```

8. Checkout back to the main branch

```
git checkout main
```

9. Go to github and raise a pull request. Your work here is done
10. Wait for code maintaner to approve your pull request and merge your branch with the main branch. Your branch will then be deleted. Don't forget to update your main branch to see the newly merged changes!

```
git pull
```
