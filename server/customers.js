import { randomBytes, createHash } from 'crypto';
import { ApiKey } from './db/models/index';

export const hashAPIKey = (apiKey) =>
  createHash('md5').update(apiKey).digest('hex');

export const generateAPIKey = async () => {
  const apiKey = randomBytes(16).toString('hex');
  const hashedAPIKey = hashAPIKey(apiKey);

  const hashedApiKeyExists = await ApiKey.findByPk(hashedAPIKey);

  if (hashedApiKeyExists) {
    generateAPIKey();
  } else {
    return { hashedAPIKey, apiKey };
  }
};
