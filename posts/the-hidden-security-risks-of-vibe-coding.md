---
title: The hidden security risks of vibe coding
date: 2026-09-14
tag: Security
lede: Vibe coding makes software dramatically easier to build. The uncomfortable part is that working code can still be insecure code.
image: https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1800&q=85
---

Vibe coding changes the relationship between a person and software. Instead of spending hours writing every function, developers can describe what they want, let an AI coding assistant build it, run the result, and keep iterating until the application feels right.

That is powerful.

It is also where the security problem begins.

The danger is not that AI always writes bad code. It does not. The danger is that it can produce convincing, functional software faster than a person can meaningfully inspect every decision inside it. A page can look polished. An API can return the expected response. Authentication can appear to work. The deployment can succeed.

And somewhere underneath, the application may still be trusting the wrong input, exposing the wrong data, granting the wrong permission, or depending on a package that should never have been there.

## Working is not the same as secure

Traditional development already has security problems. Humans forget authorization checks, mishandle secrets, write unsafe queries, expose internal errors, and introduce vulnerable dependencies.

Vibe coding does not invent these problems.

It changes their scale.

Recent security research is beginning to show the gap. A 2026 study of AI-generated web applications found that explicitly including security requirements in the prompt reduced confirmed security findings compared with otherwise identical prompts. The result is preliminary, but the lesson is useful: security does not automatically appear simply because an AI system was asked to build an application.

The generated application still needs to be treated as software that has not earned trust yet.

> AI can accelerate the production of code. It cannot accelerate your responsibility for what that code does.

## The authentication trap

Authentication is one of the easiest places for a vibe-coded application to look finished before it is actually safe.

An AI can quickly generate login forms, password hashing, JWT handling, sessions, refresh tokens, password resets, and protected routes. The interface works. The user can sign in. The dashboard appears.

But authentication is only half the problem.

Authorization is where many applications quietly fail.

A route might correctly establish that a user is logged in while failing to establish that the user is allowed to access the particular record being requested.

For example:

`/api/users/42/invoices`

may correctly reject an anonymous visitor while still returning user 42's invoices to user 41.

The application is authenticated.

The data is not authorized.

This distinction is easy to miss when the development loop is primarily visual: build, run, inspect, prompt again.

## AI tends to optimize for the requested outcome

Coding assistants are exceptionally good at satisfying explicit requirements.

That can become a problem when security requirements are implicit.

If the instruction is:

> Build an admin dashboard where administrators can manage users.

the model will focus on building the dashboard and management functionality.

If the instruction is:

> Build an admin dashboard where only users with the administrator role can access user management, enforce authorization on every server-side operation, prevent horizontal and vertical privilege escalation, validate all input, protect secrets, and fail closed when permissions are unclear.

the security boundary has been made explicit.

The difference matters.

OWASP's current guidance for generative AI applications highlights risks such as prompt injection, insecure output handling, supply-chain vulnerabilities, and excessive agency. These risks become particularly relevant when an AI coding agent is not merely generating text but can interact with files, packages, terminals, repositories, and deployment systems.

The safer assumption is therefore simple: **if the agent can take an action, that action needs a security boundary.**

## The dependency problem

One of the less obvious risks of AI-assisted development is the dependency it decides to use.

Ask an AI to implement a feature and it may recommend a library you have never heard of. Sometimes that library is legitimate and well maintained. Sometimes the package name is wrong, outdated, unnecessary, or simply invented.

This creates a new variation of an old software supply-chain problem.

The developer may trust the suggestion because the package solves the problem immediately. The application installs. The import works. The feature is complete.

But dependency selection is part of the security architecture.

A package can introduce vulnerable transitive dependencies, excessive permissions, abandoned code, malicious releases, or unnecessary attack surface.

The rule should be straightforward:

**Do not trust a dependency because an AI recommended it.**

Verify it.

Check its provenance. Check its maintenance. Check its version. Check known vulnerabilities. Check what it actually does.

The same principle applies to code copied directly from generated output.

## Secrets are still secrets

There is another failure mode that feels almost embarrassingly simple: putting secrets where they do not belong.

AI-generated applications can accidentally place API keys in frontend code, commit credentials to repositories, expose configuration values through logs, or create example files containing realistic-looking secrets.

The problem becomes worse when developers paste real credentials, private configuration, database URLs, or proprietary code into external AI systems without considering what information they are disclosing.

A secret should remain a secret regardless of whether the code was written by a human, generated by an AI, or assembled by both.

Environment variables, secret managers, least-privilege credentials, proper `.gitignore` rules, secret scanning, and rotation policies still matter.

There is no AI shortcut around them.

## The database can look correct and still be dangerous

Vibe coding also makes it surprisingly easy to build database operations that work perfectly during testing while failing under adversarial input.

An AI can generate SQL queries, ORM models, migrations, filters, search endpoints, and CRUD operations in seconds.

But correctness has layers.

The query may return the right records while leaking records belonging to another tenant. A delete endpoint may accept an identifier without checking ownership. A search endpoint may expose fields that should never reach the client. A migration may remove a constraint that another part of the application quietly depended on.

This is why database security cannot be reduced to asking an AI whether the SQL is valid.

The important questions are:

Who can execute this operation?

Which records can they affect?

Which fields can they see?

What happens when the input is malformed?

What happens when the user changes an identifier manually?

What happens when the request comes from a different tenant?

These are authorization questions as much as database questions.

## The agent itself can become an attack surface

Vibe coding becomes significantly more interesting when the AI is no longer just generating code in a chat window.

Modern coding agents can read repositories, execute commands, install packages, modify files, create commits, access terminals, and interact with external tools.

That changes the threat model.

A malicious instruction hidden inside a repository file, documentation page, dependency, issue, or other piece of content could potentially influence what an agent does.

This is part of the broader prompt-injection problem. OWASP describes prompt injection as an attack in which crafted input manipulates an LLM's behavior. When an AI has tools and permissions, the consequences can move beyond an incorrect answer and into an actual system action.

The question is no longer simply:

> Can the AI generate insecure code?

It becomes:

> What can the AI do if it is manipulated into making the wrong decision?

That is a much more serious security question.

## Speed creates a review problem

The biggest advantage of vibe coding is also one of its biggest weaknesses.

It increases output.

A developer who previously wrote a few hundred lines may now generate thousands. A small team can produce several prototypes in the time it previously took to build one.

But security review does not automatically accelerate at the same rate.

Recent reporting has highlighted exactly this visibility problem: organizations can become confident in the production readiness of AI-generated code while simultaneously seeing more incidents and struggling to maintain effective oversight.

More code is not necessarily more productivity if the organization cannot understand, test, review, and maintain what it has produced.

The bottleneck simply moves.

It moves from writing code to understanding code.

## So, should we stop vibe coding?

No.

That would miss the point.

Vibe coding is useful precisely because it removes a large amount of mechanical work. It lets developers prototype faster, explore ideas, automate repetitive implementation, and build software that might otherwise never have been attempted.

The answer is not to reject the tool.

It is to change the workflow around it.

Treat generated code as a first draft.

Make security requirements explicit in prompts.

Review authentication and authorization manually.

Verify dependencies rather than blindly installing them.

Scan for secrets.

Run static analysis and dependency checks.

Test APIs with malicious input, not only happy paths.

Use least privilege for agents and development environments.

Keep production credentials away from autonomous coding workflows.

And, most importantly, understand the code before giving it access to something you care about.

## The new engineering skill is judgment

The most important skill in vibe coding may not be prompting.

It is judgment.

Knowing when generated code is reasonable.

Knowing when it is suspicious.

Knowing which parts need human review.

Knowing what permissions an agent should have.

Knowing when a five-minute implementation has created a five-hour security problem.

The strongest AI-assisted developers will not necessarily be the people who generate the most code. They will be the people who can move quickly while maintaining a clear mental model of the system they are building.

That distinction matters because security is not a property that appears when an application starts successfully.

It is something you deliberately design, test, review, and maintain.

> Vibe coding can make software cheap to create. It does not make security cheap to get right.

---

*If you are building with AI coding tools, the goal is not to code less carefully. It is to make careful engineering scale with the speed of generation.*
