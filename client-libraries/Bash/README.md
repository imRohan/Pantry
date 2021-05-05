# Bash-script to access [Pantry](https://getpantry.cloud/) [API](https://documenter.getpostman.com/view/3281832/SzmZeMLC)

Source the library first

```bash
. ./pantry-client.bash "Your_Pantry_ID_here"
```

Or, better yet, put the above command inside the file `~/.bashrc`. This would make Bash source the library automatically on startup.

### Usage:

- Create/replace basket

  ```bash
  pantry_create <name of basket>
  ```

- Add contents to / update contents of basket

  ```bash
  echo '{"newKey":"newVal","oldKey":"newerVal"}' | pantry_update <name of basket>
  ```

- Retrieve all contents of basket

  ```bash
  pantry_retrieve <name of basket>
  ```

- Delete basket

  ```bash
  pantry_delete <name of basket>
  ```

  

