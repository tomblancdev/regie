# tomblancdev.regie — the fleet driver

The engine is the product ([`regie`](..)); this collection is how a fleet
runs it. Data in, the engine's verbs out — the roles know nothing about
where they run: no lane, no gateway, no log shipper, no backup server.
Those are the fleet's own roles, beside these.

| Role | Does | Status |
|---|---|---|
| [`engine`](roles/engine) | installs the CLI on the brain's host, in a venv, from this collection's own tag | 0.1 |
| [`brain`](roles/brain) | hands `home.yml` + the secret values to the engine on the host: `check` → `render` into the root → `up` → `apply` | contract; lands with 0.2 |

```yaml
- hosts: home
  roles:
    - role: tomblancdev.regie.engine
    - role: tomblancdev.regie.brain
      vars:
        regie_home_yml: "{{ playbook_dir }}/home/home.yml"
        regie_secrets: "{{ my_store.home }}"   # values — the store is yours
```
