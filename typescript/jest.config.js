/** @type {import('jest').Config} */

const answerName = process.env.PRACTICE_ANSWER // e.g. 'kk_answer_01_donation_processor'

/**
 * When PRACTICE_ANSWER is set, Jest redirects imports of the corresponding
 * practice_problems stub to the answer file in practice_problem_answers/,
 * so tests run against the implementation without any changes to the test files.
 *
 * Usage (from typescript/):
 *   PRACTICE_ANSWER=kk_answer_01_donation_processor npm run test:01
 *
 * Or via run_tests.sh from the repo root:
 *   ./run_tests.sh \
 *     -f typescript/practice_problem_answers/kk_answer_01_donation_processor.ts \
 *     -c npm run test:01
 *
 * The answer filename's prefix is a per-developer namespace and is NOT
 * significant to resolution — only the trailing "NN_<name>" segment is used to
 * locate the stub, matching the behaviour of python/conftest.py. Any prefix
 * works (kk_, cw_, en_, or none), so several developers can keep separate
 * answers for the same problem side by side. Nothing is auto-discovered: if
 * PRACTICE_ANSWER is unset, the tests run against the stub.
 */
function buildModuleNameMapper() {
  if (!answerName) return {}

  // Derive the stub module from the trailing NN_<name> segment, so every
  // namespace resolves to the same stub:
  //   kk_answer_01_donation_processor → problem_01_donation_processor
  //   cw_answer_01_donation_processor → problem_01_donation_processor
  //   01_donation_processor           → problem_01_donation_processor
  const match = answerName.match(/(\d{2}_[a-z0-9_]+)$/)
  if (!match) {
    // Fail loudly. Returning an unmatched mapper would silently run the tests
    // against the stub, making a correct implementation look broken.
    throw new Error(
      `PRACTICE_ANSWER='${answerName}' does not match the expected naming pattern.\n` +
        `The name must end with a segment like '01_donation_processor'.\n` +
        `Example: PRACTICE_ANSWER=kk_answer_01_donation_processor`,
    )
  }

  const problemName = `problem_${match[1]}`
  return {
    [`.*practice_problems/${problemName}(\\.ts)?$`]:
      `<rootDir>/practice_problem_answers/${answerName}.ts`,
  }
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: buildModuleNameMapper(),
}
