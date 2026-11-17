# WATCHTOWER CRYPTO — Independent Cultural Research Workspace

**Study the signal. Challenge the noise.**

Watchtower Crypto is an independent research product connected to the BodyBagz vision of original cultural creation and better decision-making. Its initial release helps builders collect evidence, watch public creator activity manually, challenge assumptions, and optionally export well-described opportunities.

## Standalone application V0.1

- Evidence-linked local research journal with structured hypothesis/observation, domain, source link and explicit disconfirming risk.
- Manual public creator/KOL bookmarks and research notes.
- Local domain filter and source-linked review cards.
- One-record-at-a-time export in `bodybagz.opportunity.v1` format.
- Responsive standalone frontend with separate storage key, Node tests, and headless desktop/mobile workflow.
- **No live price feeds, rankings, Pump.fun/DEX API, scraped KOL posts, follower statistics, automated wallet analysis, investment calls, trading, token launch execution or verified endorsements.**

The cultural-research prompt cards on the homepage are examples **to investigate**. They are not current or independently verified trending metas.

## Run it

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
npm run quality
```

The GitHub Actions quality workflow also runs a browser end-to-end test of source validation, manual research, creator CRUD, JSON export, filtering, storage and mobile navigation.

### GitHub Pages

Pages is **not yet enabled** for this new repository. When ready, choose **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**. After the platform confirms deployment, the expected public URL is:

https://egoshiftlabs.github.io/Watchtower-Crypto/

Until then, the project exists as executable code in GitHub, not a verified live site.

## Integration contract pinned to BodyBagz V0.2

Opportunity export envelope: `bodybagz.opportunity.v1`. Immutable upstream schema:

https://github.com/EgoShiftLabs/BodyBagz-Ecosystem/blob/690ca6e66dc705ce6eb2b963932a873dea73342f/contracts/opportunity.v1.schema.json

A matching copy is maintained in `contracts/opportunity.v1.schema.json`. Exported records include title, type/domain, observation, disconfirming risk, HTTPS source URL, creation timestamp, and `evidenceStatus: user-supplied-unverified`.

This is **user-opt-in file export only**. It does not automatically transmit a research note to BAGZ Forge, access the hub's localStorage, or approve a proposal. A future receiving app must validate the contract and obtain user consent. Source linkage is not independent verification.

## Next milestones

1. Validate the concept with human researchers using sourced observations and counterexamples.
2. Research provider licensing and permitted market/KOL API access; do not invent feed or performance data.
3. Add optional public read-only market evidence with timestamps, quality indicators and concentration-risk methodology.
4. Add provenance tests, data quality indicators and review outcomes; separate opinions from observations.
5. Develop a consent-based integration API with the future independently deployed BAGZ Forge.

Watchtower OS remains a separate general-purpose intelligence application: https://egoshiftlabs.github.io/EgoShiftLabs-Watchtower-OS/

See [SECURITY.md](docs/SECURITY.md).
