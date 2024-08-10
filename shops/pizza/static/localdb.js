export function open(name, version) {
    return {'name':name, 'version':version};
}

export function set(sdb, objects) {
    return new Promise((resolve, reject) => {
        const rdb = indexedDB.open(sdb.name, sdb.version);
        rdb.onupgradeneeded = (event) => {
            const db = event.target.result;
            Object.keys(objects).forEach(object_store => {
                if (!db.objectStoreNames.contains(object_store)) {
                    const odb = db.createObjectStore(object_store, { keyPath: objects[object_store]['key'] });
                    objects[object_store]['fields'].forEach(field => {
                        odb.createIndex(field.name, field.name, field.params);
                    });
                }
            });
        };

        rdb.onsuccess = (event) => {
            resolve(event.target.result); 
        };

        rdb.onerror = (event) => {
            reject(event.target.error); 
        };
    });
}

export function get(sdb, object, key=null) {
    return new Promise((resolve, reject) => {
        const rdb = indexedDB.open(sdb.name, sdb.version);
        rdb.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([object], 'readonly');
            const store = transaction.objectStore(object);
            var request;
            if (key === null) {
                request = store.getAll();
            } else {
                request = store.get(key); 
            }
            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        };

        rdb.onerror = (event) => {
            reject(rdb.error);
        };
    });

}

export function add(sdb, object, data) {
    return new Promise((resolve, reject) => {
        const rdb = indexedDB.open(sdb.name, sdb.version);
        rdb.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([object], 'readwrite');
            const store = transaction.objectStore(object);
            const request = store.put(data);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(request.error);
            };
        };
        rdb.onerror = (event) => {
            reject(rdb.error);
        };
    });
}

export function remove(sdb, object, key) {
    return new Promise((resolve, reject) => {
        const rdb = indexedDB.open(sdb.name, sdb.version);
        rdb.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([object], 'readwrite');
            const store = transaction.objectStore(object);
            const request = store.delete(key);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(request.error);
            };
        };
        rdb.onerror = (event) => {
            reject(rdb.error);
        };
    });
}


/*
const DB = ldb.open('db', 1);
ldb.set(DB, {
    'basket': {
        'key': 'id',
        'fields': [
            {'name': 'name', 'params':{'unique': false}},
            {'name': 'price', 'params':{'unique': false}},
            {'name': 'qty', 'params':{'unique': false}}
        ]
    },
    'filters_ingradient_active': {
        'key': 'ingredient',
        'fields': [
            {'name': 'ingredient', 'params':{'unique': false}}
        ]
    }
});
ldb.add(DB, 'basket', {
    'id': 11, 
    'name': 'pizza', 
    'price': 10, 
    'qty': 1 
});

ldb.add(DB, 'filters_ingradient_active', {'ingredient': 'Banana'});
ldb.get(DB, 'basket').then(data => {
    console.log(data);
});
ldb.get(DB, 'filters_ingradient_active').then(data => {
    console.log(data);
});
*/


/*
export function init_f() {
    const rldb = indexedDB.open('db', 1);

    rldb.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('basket')) {
            const ldb = db.createObjectStore('basket', { keyPath: 'id' });
            ldb.createIndex('name', 'name', {unique: false});
            ldb.createIndex('price', 'price', {unique: false});
            ldb.createIndex('qty', 'qty', {unique: false});
        }

        if (!db.objectStoreNames.contains('filters_ingradient_active')) {
            const ldb = db.createObjectStore('filters_ingradient_active', { keyPath: 'ingredient' });
            ldb.createIndex('ingredient', 'ingredient', {unique: false});
        }
    };

    rldb.onerror = (event) => {
        console.error('IndexedDB error:', event.target.errorCode);
    };

}
*/