# Local verification checklist
- [ ] PostgreSQL is running and `lifeshield_db` exists.
- [ ] Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in the backend terminal.
- [ ] Start Spring Boot and confirm `http://localhost:8080/api/health` returns `status: UP`.
- [ ] In another terminal, run `cd frontend`, `npm install`, and `npm run dev`.
- [ ] Register a test account, sign out, and sign in again.
- [ ] Add dashboard data, refresh, and verify it remains.
- [ ] Create a second account and confirm it does not see the first account's backend-synced state.
- [ ] Do not use real patient/medical data; this is an educational demo.
