<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ui-ux-pro-max-rules -->
# UI/UX Pro Max is the default design skill here

For any task involving UI, UX, layout, visual design, frontend polish, presentation design, dashboards, components, landing pages, print/PDF layout, or design-system decisions, use the `ui-ux-pro-max` skill before making design or implementation choices.

Start by generating or consulting a design-system recommendation with the local skill search script, then apply the repo's existing Next.js/Tailwind patterns:

```powershell
python .codex\skills\ui-ux-pro-max\scripts\search.py "<product context and design goal>" --design-system -p "Sistema Elephant" -f markdown
```

If the active environment does not expose the `ui-ux-pro-max` skill automatically, read `.codex/skills/ui-ux-pro-max/SKILL.md` and use its `scripts/search.py` workflow manually.
<!-- END:ui-ux-pro-max-rules -->
