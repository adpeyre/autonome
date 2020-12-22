import { validateSync } from 'class-validator';

export default new (class ConfigValidator {
  public validates(config: object): string[][] {
    const validationErrors = validateSync(config, { skipMissingProperties: false, forbidNonWhitelisted: true });
    if (0 < validationErrors.length) {
      return validationErrors.map((validationError) => (validationError.constraints ? Object.values(validationError.constraints) : []));
    }

    return [];
  }
})();
