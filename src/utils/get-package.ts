import * as path from 'path';

import { AppState } from '../renderer/state';
import { UNTITLED_NAME } from '../constants';
import { EditorValues } from '../interfaces';
import { findModulesInEditors } from '../renderer/npm';

export interface PackageJsonOptions {
  includeElectron?: boolean;
  includeDependencies?: boolean;
}

/**
 * Returns the package.json for the current Fiddle
 *
 * @param {AppState} appState
 * @param {EditorValues} [values]
 * @param {PackageJsonOptions} [options]
 * @returns {string}
 */
export function getPackageJson(
  appState: AppState, values?: EditorValues, options?: PackageJsonOptions
): string {
  const { includeElectron, includeDependencies } = options || {
    includeElectron: false,
    includeDependencies: false
  };

  const name = appState.localPath
    ? path.basename(appState.localPath)
    : UNTITLED_NAME;

  const devDependencies: Record<string, string> = {};
  const dependencies: Record<string, string> = {};

  if (includeElectron) {
    devDependencies.electron = appState.version;
  }

  if (includeDependencies && values) {
    findModulesInEditors(values).forEach((module) => {
      dependencies[module] = '*';
    });
  }

  return JSON.stringify({
    name,
    main: './main.js',
    version: '1.0.0',
    dependencies,
    devDependencies
  }, undefined, 2);
}