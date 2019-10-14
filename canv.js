const os = require('electron').remote.getGlobal('sharedObject').os
const settings = require('electron').remote.getGlobal('settings')

let system

let d = new DrawJS('c')
d.resize(300, 200)

setInterval( () => {
	d.getContext().clearRect(0, 0, settings.windowSize.width, settings.windowSize.height)
	
	system = {
		arch: os.arch(),
		platform: os.platform(),
		release: os.release(),
		hostname: os.hostname(),
		load: (os.loadavg()[0] / os.cpus().length * 100).toFixed(2),
		uptime: (os.uptime() / 3600).toFixed(2),
		cpu: {
			cores: os.cpus().length,
			name: os.cpus()[0].model,
			speed: os.cpus()[0].speed / 1000
		},
		memory: {
			total: (os.totalmem() / 1048576).toFixed(2),
			used: (os.freemem() / 1048576).toFixed(2)
		}
	}

	let info = system.hostname + ' - ' + system.platform + ' ' + system.release + ' ' + system.arch
	let cpuname = system.cpu.name
	let cpuspeed = 'cores: ' +system.cpu.cores + ' | load: ' + system.load + '% | ' + system.cpu.speed + 'GHz'
	let uptime = 'uptime: ' + system.uptime + ' hours'
	let memory = 'memory: ' + system.memory.used + 'MB used / ' + system.memory.total + 'MB'

	d.write(info, 10, 15, settings.mainColor, true, settings.font)
	d.write(cpuname, 10, 30, settings.mainColor, true, settings.font)
	d.write(cpuspeed, 10, 45, settings.mainColor, true, settings.font)
	
	d.rect(10, 50, 290, 10, settings.barColor, false)
	d.rect(10, 50, (system.load * 290 / 100), 10, settings.barColor, true)
	
	d.write(uptime, 10, 75, settings.mainColor, true, settings.font)
	d.write(memory, 10, 90, settings.mainColor, true, settings.font)

	let oldRange = (system.memory.total - 0),
		newRange = (settings.windowSize.width - 10),
		newValue = (((system.memory.used - 0) * newRange) / oldRange) + 10
	d.rect(10, 95, 290, 10, settings.barColor, false)
	d.rect(10, 95, newValue, 10, settings.barColor, true)
	
	//console.log(system.hostname + '-' + system.platform + ' ' + system.release + ' ' + system.arch)
}, settings.refreshRate)