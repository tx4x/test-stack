import { NavigationOptions } from 'puppeteer';
export const defaultTenant = 1;
export const userSessionsTab = (base: string) => `${base}/`;
export const loginUrl = (base: string) => `${base}/login`;
export const loginUrlDemoDev = () => `https://onearmylabs.com/`;
export const defaultPageOptions = (): NavigationOptions => {
  return {
    timeout: 5000,
    waitUntil: 'networkidle2'
  };
};

export const replay_api_overview = 'usersearchoverview';

const ts = () => {
  const d = new Date();
  return d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds();
};

export const sessionName = (url?: string) => `Pupeteer :${ts()}`;
export const maxSessionWaitingTime = 1000 * 60 * 3;
export const responseRetryTime = 1000 * 8;
export const defaultMutationRoot = '#mutationsRoot';
export const defaultMutationTag = 'div';
export const defaultHeavyMutations = 2000;
export const defaultMediumMutations = 500;
