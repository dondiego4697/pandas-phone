import * as fs from 'fs';
import * as path from 'path';

import {makeRequest} from '../src/server/db/client';

const text = fs.readFileSync(path.resolve('./src/server/migration/create-tables.pgsql'), 'utf-8');
(async () => {
    await makeRequest({text});
    process.exit();
})();
