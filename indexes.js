
col = db.syslog;

col.ensureIndex({
	level: 1
})
col.ensureIndex({
	tags: 1
})
col.ensureIndex({
	host: 1
})
col.ensureIndex({
	"@timestamp": -1
}, {
	expireAfterSeconds: 604800
})

db.syslog.getIndexes()