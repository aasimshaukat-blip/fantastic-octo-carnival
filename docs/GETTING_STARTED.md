# Getting Started (for non-technical users)

This guide assumes **zero coding experience**. Follow it top to bottom. It takes
about 10–15 minutes the first time.

You'll do four things: install one tool (Node.js), download the code, run three
commands, and open the app in your browser.

---

## Step 1 — Install Node.js (the engine that runs the app)

1. Go to **https://nodejs.org**
2. Click the big green button that says **"LTS"** (it will say a version number
   like `22.x.x LTS`).
3. Open the downloaded file and click **Next / Continue / Agree** through the
   installer until it finishes. The default options are fine.
4. To confirm it worked, open a terminal (see Step 3 for how) and type:
   ```
   node --version
   ```
   If it prints a version number like `v22.11.0`, you're good.

You only ever do this step once.

---

## Step 2 — Download the code

1. Go to the project page on GitHub in your browser.
2. Make sure the branch selector (a dropdown near the top-left, usually says
   `main`) is set to **`claude/laughing-heisenberg-eju9bk`**.
3. Click the green **`<> Code`** button → **Download ZIP**.
4. Find the downloaded ZIP file (usually in your **Downloads** folder) and
   **unzip / extract** it. You'll get a folder like
   `fantastic-octo-carnival`.
5. Remember where this folder is — you'll need it in the next step.

---

## Step 3 — Open a terminal **inside that folder**

A "terminal" is a window where you type commands. Here's the easy way to open
one already pointing at the right folder:

### On Windows
1. Open the project folder in **File Explorer**.
2. Click the address bar at the top (where the folder path is shown), type
   `cmd`, and press **Enter**. A black terminal window opens in that folder.

### On Mac
1. Open **Terminal** (press `Cmd + Space`, type `Terminal`, press Enter).
2. Type `cd ` (the letters c, d, then a space — don't press Enter yet).
3. Drag the project folder from Finder onto the Terminal window, then press
   **Enter**.

You can tell it worked if the terminal line shows the folder name.

---

## Step 4 — Run three commands

Type each line below, pressing **Enter** after each one. **Wait for each to
finish** before typing the next (the first two can take a minute or two — that's
normal).

```
npm install
```
> Downloads everything the app needs. You'll see a lot of text scroll by — that's fine.

```
npm run setup
```
> Creates the database and the demo login accounts. When it's done you'll see
> **"✅ Setup complete!"** and a list of logins.

```
npm run dev
```
> Starts the app. When you see a line containing **`http://localhost:3000`**,
> it's running. **Leave this terminal window open** — closing it stops the app.

---

## Step 5 — Open the app and log in

1. Open your web browser (Chrome, Edge, Safari…).
2. Go to: **http://localhost:3000**
3. Log in with one of these accounts (copy them exactly — they're
   **case-sensitive**, capital letters and the `@` symbol matter):

   | Role | Email | Password |
   | --- | --- | --- |
   | **Admin (full access)** | `admin@acecontracting.ae` | `Admin@1234` |
   | Project Manager | `pm.ruwais@acecontracting.ae` | `Pm@123456` |
   | Site Supervisor | `sup.ruwais@acecontracting.ae` | `Sup@123456` |
   | Procurement | `procurement@acecontracting.ae` | `Proc@12345` |
   | HR | `hr@acecontracting.ae` | `Hr@1234567` |

Start with **Admin** to see everything.

---

## Coming back later

Once it's set up, you don't repeat the whole thing. Just:

1. Open a terminal in the project folder (Step 3).
2. Run:
   ```
   npm run dev
   ```
3. Open **http://localhost:3000**.

---

## If something goes wrong

| Problem | Fix |
| --- | --- |
| `npm` is not recognized / command not found | Node.js isn't installed correctly — redo Step 1, then **close and reopen** the terminal. |
| Login says "Invalid email or password" | The demo accounts weren't created. Run `npm run setup` again and watch for **"✅ Setup complete!"**. |
| Passwords not working | They're case-sensitive. `Admin@1234` has a capital **A** and the **@** symbol. Avoid extra spaces. |
| The browser page won't load | Make sure the terminal running `npm run dev` is still open and shows `http://localhost:3000`. |
| Want to start the data fresh | Run `npm run db:reset`, then `npm run dev`. |
| `http://localhost:3000` is busy | Another copy may be running. Close other terminals, or open the address the terminal actually printed (it may say `:3001`). |

If you're still stuck, copy the red/error text from the terminal or the login
page and share it — that tells us exactly what to fix.
