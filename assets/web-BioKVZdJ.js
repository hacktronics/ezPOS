import{B as h,W as u}from"./index-DZpm7Dsx.js";class m{constructor(){this.isExists=!1,this.retExists={isExists:!1,pathWasm:""},this.initSqlJs=require("sql.js"),this.OS=require("os"),this.FS=require("fs"),this.Path=require("path")}getTypeOrmDBFolder(){var e=__dirname.indexOf("node_modules"),e=__dirname.slice(0,e),e=this.Path.basename(e),t=this.Path.join(this.OS.homedir(),"Documents"),t=this.Path.join(t,"CapacitorSQLite",e);return this.FS.mkdirSync(t,{recursive:!0}),t}getTypeOrmDBPath(e,t){return this.Path.resolve(e,t)}async checkFileExistence(t){var e=await this.checkFolderExistence("public")?"public":"src",e=this.Path.join(e,t),t={};t.pathWasm=e;try{return this.FS.existsSync(e)?t.isExists=!0:t.isExists=!1,Promise.resolve(t)}catch(e){return t.isExists=!1,Promise.resolve(t)}}async checkFolderExistence(e){try{return this.FS.existsSync(e)?Promise.resolve(!0):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}async openOrCreateDatabase(e,t){let s;var r="OpenOrCreateDatabase";try{this.retExists=await this.checkFileExistence(e),this.isExists=this.retExists.isExists}catch(e){this.isExists=!1}if(!this.isExists)return Promise.reject(r+" No sql-wasm.wasm found in "+e);try{var n,i={locateFile:e=>"".concat(this.retExists.pathWasm,"/").concat(e)},a=await this.initSqlJs(i);return s=this.FS.existsSync(t)?(n=this.FS.readFileSync(t),new a.Database(n)):new a.Database,Promise.resolve(s)}catch(e){return Promise.reject(r+" open database failed")}}async saveDatabase(e,t){try{var s=e.export();return this.FS.writeFileSync(t,h.from(s)),Promise.resolve()}catch(e){return Promise.reject(e)}}closeDB(t){try{return t.close(),Promise.resolve()}catch(e){t=e.message||e;return Promise.reject("".concat("closeDB"," ").concat(t))}}async dbChanges(t){var e;try{return e=t.exec("SELECT total_changes()")[0].values[0][0],Promise.resolve(e)}catch(e){t=e.message||e;return Promise.reject("DbChanges failed: ".concat(t))}}async getLastId(t){var e;try{return e=t.exec("SELECT last_insert_rowid()")[0].values[0][0],Promise.resolve(e)}catch(e){t=e.message||e;return Promise.reject(new Error("GetLastId failed: ".concat(t)))}}async execute(e,t){try{e.exec(t);var s=await this.dbChanges(e);return Promise.resolve(s)}catch(e){t=e.message||e;return Promise.reject(new Error("Execute failed: ".concat(t)))}}async run(e,t,s,r){let n,i=[];var a={};try{n=0<s.length?e.exec(t,s):e.exec(t),("all"===r||"one"===r)&&n&&0<n.length&&(i=this.getReturnedValues(n[0],r));var o=await this.getLastId(e);return a.lastId=o,null!=i&&0<i.length&&(a.values=i),Promise.resolve(a)}catch(e){s=e.message||e;return Promise.reject(new Error("Run failed: ".concat(s)))}}getReturnedValues(t,e){var s=[];for(const n of t.values){var r={};for(let e=0;e<t.columns.length;e++)r[t.columns[e]]=n[e];if(s.push(r),"one"===e)break}return s}async queryAll(t,s,r){try{let e=[];var n;return 0==(e=null!=r&&0<r.length?t.exec(s,r):t.exec(s)).length?Promise.resolve([]):(n=e[0].values.map(s=>{const r={};return e[0].columns.forEach((e,t)=>{r["".concat(e)]=s[t]}),r}),Promise.resolve(n))}catch(e){r=e.message||e;return Promise.reject(new Error("queryAll: ".concat(r)))}}}class w{constructor(){this.wasmPath="assets",this.sqliteUtil=new m,this.typeOrmDBFolder=this.sqliteUtil.getTypeOrmDBFolder(),this.dbPath="",this.mDb=null,this._isDBOpen=!1}async open(e){try{return this.dbPath=this.sqliteUtil.getTypeOrmDBPath(this.typeOrmDBFolder,"".concat(e,"SQLite.db")),this.mDb=await this.sqliteUtil.openOrCreateDatabase(this.wasmPath,this.dbPath),this._isDBOpen=!0,Promise.resolve()}catch(e){return Promise.reject("Open: ".concat(e))}}async close(){try{return this._isDBOpen&&(await this.sqliteUtil.saveDatabase(this.mDb,this.dbPath),await this.mDb.close()),Promise.resolve()}catch(e){return Promise.reject("Close: ".concat(e))}}async executeSQL(e){let t=-1;try{if(this._isDBOpen){var s=await this.sqliteUtil.dbChanges(this.mDb);if((t=await this.sqliteUtil.execute(this.mDb,e))<0)return Promise.reject(new Error("ExecuteSQL: changes < 0"));t=await this.sqliteUtil.dbChanges(this.mDb)-s}return Promise.resolve(t)}catch(e){return Promise.reject("ExecuteSQL: ".concat(e))}}async run(e,t,s){var r={changes:-1,lastId:-1};try{if(this._isDBOpen){var n=await this.sqliteUtil.dbChanges(this.mDb),i=await this.sqliteUtil.run(this.mDb,e,t,s),a=i.lastId;if(a<0)return Promise.reject(new Error("RunSQL: lastId < 0"));var o=await this.sqliteUtil.dbChanges(this.mDb)-n;r.changes=o,r.lastId=a,r.values=i.values||[]}return Promise.resolve({changes:r})}catch(e){return Promise.reject("Run: ".concat(e))}}async selectSQL(e,t){let s=[];try{return this._isDBOpen&&(s=await this.sqliteUtil.queryAll(this.mDb,e,t)),Promise.resolve({values:s})}catch(e){return Promise.reject("SelectSQL: ".concat(e))}}}class b extends u{constructor(){super(...arguments),this.jeepSqliteElement=null,this.isWebStoreOpen=!1,this.databases={}}async initWebStore(){await customElements.whenDefined("jeep-sqlite"),this.jeepSqliteElement=document.querySelector("jeep-sqlite"),this.ensureJeepSqliteIsAvailable(),this.jeepSqliteElement.addEventListener("jeepSqliteImportProgress",e=>{this.notifyListeners("sqliteImportProgressEvent",e.detail)}),this.jeepSqliteElement.addEventListener("jeepSqliteExportProgress",e=>{this.notifyListeners("sqliteExportProgressEvent",e.detail)}),this.jeepSqliteElement.addEventListener("jeepSqliteHTTPRequestEnded",e=>{this.notifyListeners("sqliteHTTPRequestEndedEvent",e.detail)}),this.jeepSqliteElement.addEventListener("jeepSqlitePickDatabaseEnded",e=>{this.notifyListeners("sqlitePickDatabaseEndedEvent",e.detail)}),this.jeepSqliteElement.addEventListener("jeepSqliteSaveDatabaseToDisk",e=>{this.notifyListeners("sqliteSaveDatabaseToDiskEvent",e.detail)}),this.isWebStoreOpen||(this.isWebStoreOpen=await this.jeepSqliteElement.isStoreOpen())}async saveToStore(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.saveToStore(e)}catch(e){throw new Error("".concat(e))}}async getFromLocalDiskToStore(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.getFromLocalDiskToStore(e)}catch(e){throw new Error("".concat(e))}}async saveToLocalDisk(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.saveToLocalDisk(e)}catch(e){throw new Error("".concat(e))}}async echo(e){return this.ensureJeepSqliteIsAvailable(),this.jeepSqliteElement.echo(e)}async createConnection(t){if(typeof window<"u"&&window.document){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.createConnection(t)}catch(e){throw new Error("".concat(e))}}else{let e;if(!Object.keys(t).includes("database"))throw new Error("Must provide a database name");var t="RW_"+(e=t.database),s=new w;this.databases[t]=s}}async open(e){if(typeof window<"u"&&window.document){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.open(e)}catch(e){throw new Error("".concat(e))}}else{e=e.database||"";if(0===e.length)throw new Error("Must provide a database name");var t=this.getDatabaseConnectionOrThrowError("RW_"+e);try{await t.open(e)}catch(e){throw new Error("### open ".concat(e))}}}async closeConnection(e){if(typeof window<"u"&&window.document){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.closeConnection(e)}catch(e){throw new Error("".concat(e))}}else{e=e.database||"";if(0===e.length)throw new Error("Must provide a database name");var e="RW_"+e,t=this.getDatabaseConnectionOrThrowError(e);try{await t.close(),delete this.databases[e]}catch(e){throw new Error("### closeConnection ".concat(e))}}}async getVersion(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.getVersion(e)}catch(e){throw new Error("".concat(e))}}async checkConnectionsConsistency(e){this.ensureJeepSqliteIsAvailable();try{return await this.jeepSqliteElement.checkConnectionsConsistency(e)}catch(e){throw new Error("".concat(e))}}async close(e){if(typeof window<"u"&&window.document){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.close(e)}catch(e){throw new Error("".concat(e))}}else{e=e.database||"";if(0===e.length)throw new Error("Must provide a database name");e=this.getDatabaseConnectionOrThrowError("RW_"+e);try{await e.close()}catch(e){throw new Error("### close ".concat(e))}}}async beginTransaction(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.beginTransaction(e)}catch(e){throw new Error("".concat(e))}}async commitTransaction(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.commitTransaction(e)}catch(e){throw new Error("".concat(e))}}async rollbackTransaction(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.rollbackTransaction(e)}catch(e){throw new Error("".concat(e))}}async isTransactionActive(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.isTransactionActive(e)}catch(e){throw new Error("".concat(e))}}async getTableList(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.getTableList(e)}catch(e){throw new Error("".concat(e))}}async execute(e){if(typeof window<"u"&&window.document){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.execute(e)}catch(e){throw new Error("".concat(e))}}else{var t=e.database||"";if(0===t.length)throw new Error("Must provide a database name");e=e.statements||"";if(0===e.length)return Promise.reject("Must provide raw SQL statements");t=this.getDatabaseConnectionOrThrowError("RW_"+t);try{return{changes:{changes:await t.executeSQL(e)}}}catch(e){throw new Error("".concat(e))}}}async executeSet(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.executeSet(e)}catch(e){throw new Error("".concat(e))}}async run(e){if(typeof window<"u"&&window.document){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.run(e)}catch(e){throw new Error("".concat(e))}}else{var t=e.database||"";if(0===t.length)throw new Error("Must provide a database name");var s=e.statement||"";if(0===s.length)return Promise.reject("Must provide raw SQL statement");var r=e.values||[],e=e.returnMode||"no",t=this.getDatabaseConnectionOrThrowError("RW_"+t);try{return await t.run(s,r,e)}catch(e){throw new Error("".concat(e))}}}async query(e){if(typeof window<"u"&&window.document){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.query(e)}catch(e){throw new Error("".concat(e))}}else{var t=e.database||"";if(0===t.length)throw new Error("Must provide a database name");var s=e.statement||"";if(0===s.length)return Promise.reject("Must provide raw SQL statement");e=e.values||[],t=this.getDatabaseConnectionOrThrowError("RW_"+t);try{return await t.selectSQL(s,e)}catch(e){throw new Error("".concat(e))}}}async isDBExists(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.isDBExists(e)}catch(e){throw new Error("".concat(e))}}async isDBOpen(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.isDBOpen(e)}catch(e){throw new Error("".concat(e))}}async isDatabase(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.isDatabase(e)}catch(e){throw new Error("".concat(e))}}async isTableExists(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.isTableExists(e)}catch(e){throw new Error("".concat(e))}}async deleteDatabase(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.deleteDatabase(e)}catch(e){throw new Error("".concat(e))}}async isJsonValid(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.isJsonValid(e)}catch(e){throw new Error("".concat(e))}}async importFromJson(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.importFromJson(e)}catch(e){throw new Error("".concat(e))}}async exportToJson(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.exportToJson(e)}catch(e){throw new Error("".concat(e))}}async createSyncTable(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.createSyncTable(e)}catch(e){throw new Error("".concat(e))}}async setSyncDate(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.setSyncDate(e)}catch(e){throw new Error("".concat(e))}}async getSyncDate(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.getSyncDate(e)}catch(e){throw new Error("".concat(e))}}async deleteExportedRows(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.deleteExportedRows(e)}catch(e){throw new Error("".concat(e))}}async addUpgradeStatement(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.addUpgradeStatement(e)}catch(e){throw new Error("".concat(e))}}async copyFromAssets(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.copyFromAssets(e)}catch(e){throw new Error("".concat(e))}}async getFromHTTPRequest(e){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{await this.jeepSqliteElement.getFromHTTPRequest(e)}catch(e){throw new Error("".concat(e))}}async getDatabaseList(){this.ensureJeepSqliteIsAvailable(),this.ensureWebstoreIsOpen();try{return await this.jeepSqliteElement.getDatabaseList()}catch(e){throw new Error("".concat(e))}}ensureJeepSqliteIsAvailable(){if(null===this.jeepSqliteElement)throw new Error("The jeep-sqlite element is not present in the DOM! Please check the @capacitor-community/sqlite documentation for instructions regarding the web platform.")}ensureWebstoreIsOpen(){if(!this.isWebStoreOpen)throw new Error('WebStore is not open yet. You have to call "initWebStore()" first.')}getDatabaseConnectionOrThrowError(e){if(Object.keys(this.databases).includes(e))return this.databases[e];throw new Error('No connection available for database "'.concat(e,'"'))}async getUrl(){throw this.unimplemented("Not implemented on web.")}async getMigratableDbList(e){throw console.log("getMigratableDbList",e),this.unimplemented("Not implemented on web.")}async addSQLiteSuffix(e){throw console.log("addSQLiteSuffix",e),this.unimplemented("Not implemented on web.")}async deleteOldDatabases(e){throw console.log("deleteOldDatabases",e),this.unimplemented("Not implemented on web.")}async moveDatabasesAndAddSuffix(e){throw console.log("moveDatabasesAndAddSuffix",e),this.unimplemented("Not implemented on web.")}async isSecretStored(){throw this.unimplemented("Not implemented on web.")}async setEncryptionSecret(e){throw console.log("setEncryptionSecret",e),this.unimplemented("Not implemented on web.")}async changeEncryptionSecret(e){throw console.log("changeEncryptionSecret",e),this.unimplemented("Not implemented on web.")}async clearEncryptionSecret(){throw console.log("clearEncryptionSecret"),this.unimplemented("Not implemented on web.")}async checkEncryptionSecret(e){throw console.log("checkEncryptionPassPhrase",e),this.unimplemented("Not implemented on web.")}async getNCDatabasePath(e){throw console.log("getNCDatabasePath",e),this.unimplemented("Not implemented on web.")}async createNCConnection(e){throw console.log("createNCConnection",e),this.unimplemented("Not implemented on web.")}async closeNCConnection(e){throw console.log("closeNCConnection",e),this.unimplemented("Not implemented on web.")}async isNCDatabase(e){throw console.log("isNCDatabase",e),this.unimplemented("Not implemented on web.")}async isDatabaseEncrypted(e){throw console.log("isDatabaseEncrypted",e),this.unimplemented("Not implemented on web.")}async isInConfigEncryption(){throw this.unimplemented("Not implemented on web.")}async isInConfigBiometricAuth(){throw this.unimplemented("Not implemented on web.")}async loadExtension(e){throw console.log("loadExtension",e),this.unimplemented("Not implemented on web.")}async enableLoadExtension(e){throw console.log("enableLoadExtension",e),this.unimplemented("Not implemented on web.")}}export{b as CapacitorSQLiteWeb};