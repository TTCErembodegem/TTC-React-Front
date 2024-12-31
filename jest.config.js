const config = {
  // verbose: true,
  testEnvironment: 'jsdom',
  testMatch: ['**/spec/**/*Spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    "^.+.tsx?$": ["ts-jest", {
      tsconfig: 'test-tsconfig.json'
    }],
  },
};

export default config;
