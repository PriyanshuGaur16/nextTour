

```js
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

are **not directly responsible for logging users in or out**, but they play a **critical role** in how Passport handles user sessions **after** login and **before** logout.

Let’s break it down:

---

### 🔐 `serializeUser` – Happens at Login

```js
passport.serializeUser(User.serializeUser());
```

- This runs **right after a user successfully logs in** (e.g., after calling `req.login()`).
- Its job: take the user object and decide **what to store in the session**.
- Usually, it stores just the `user.id` to keep the session small.

> Think of it like: "Hey, this user is now logged in — here's their ID, please remember them."

---

### 🔄 `deserializeUser` – Happens on Every Request **After Login**

```js
passport.deserializeUser(User.deserializeUser());
```

- This runs on **every request** after the user has logged in (as long as the session exists).
- It takes the stored `user.id` from the session and **fetches the full user object from the DB**, attaching it to `req.user`.

> Think of it like: "Oh hey, this request came from someone with ID X — let me look them up and attach their info."

---

### 🚪 And What About Logging Out?

When you call:

```js
req.logout(function(err) {
  // optional callback
});
```

Passport:
- Removes the user’s session info from memory and/or cookies.
- After logout, `req.user` becomes `undefined` and `req.isAuthenticated()` returns `false`.

So while `serializeUser` and `deserializeUser` aren’t for logging out per se, they **define what login stores** and **how the user is loaded afterward**.

---

### 📌 Summary

| Function                   | When It Runs              | Purpose                                   |
|---------------------------|---------------------------|-------------------------------------------|
| `serializeUser()`         | After login               | Store user ID in the session              |
| `deserializeUser()`       | On every request after    | Fetch full user from DB and attach to `req.user` |
| `req.logout()`            | When user logs out        | Destroy session and remove user info      |

---

Let me know if you want to see a full login/logout flow diagram — it’s a fun visual!


2. Avoid caching the page

You can tell the browser not to cache pages that show flash messages:

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

This forces the browser to reload pages, so the flash message won't reappear when navigating back.

    Downside: can affect performance (as pages aren’t cached anymore)
3. Handle in the view

Use JavaScript to detect if the page is coming from the cache and hide flash messages:

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    // Page was loaded from bfcache
    const flash = document.getElementById("flash-message");
    if (flash) flash.style.display = "none";
  }
});

This way, flash messages are hidden only when user returns via browser back/forward.