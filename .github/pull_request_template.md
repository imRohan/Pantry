## Please follow these simple rules when opening a PR

- Squash your commits. Only one commit per PR.
- Describe why the change is necessary.
- Describe what changes you have made in a list.
- Be as descriptive as possible in your commit message.
- Add the github issue number at the bottom

## Example
```
Redirect user after login (this should not be more than 50 characters)

Users were being redirected to the home page after login, which is less
useful than redirecting to the page they had originally requested before
being redirected to the login form.

* Store requested path in a session variable
* Redirect to the stored location after successfully logging in the

Resolves #github-issue-number
```
