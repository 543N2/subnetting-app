/*
Application for IPv4 address subnetting
--------------------------------------------
This application determines the list of possible subnets for a
given Class C IPv4 address and number of borrowed bits for subnet mask.
--------------------------------------------
Based on the work of Ing. Alexander Garcia
Universidad EAN
2021
--------------------------------------------
*/

class IPAddress {

    constructor(address, borrowedBits = 0) {
        this.address = this.setAddress(address)
        this.class = this.setClass(this.address)
        this.netName = this.setNetName(this.address)
        this.broadcast = this.setBroadcast(this.address)
        this.subnetMask = this.setSubnetMask(borrowedBits)
        this.maxSubnets = this.setMaxSubnets(borrowedBits)
        this.maxHosts = this.setMaxHosts(borrowedBits)
        this.subnets = this.setSubnets(this.maxSubnets, this.netName, this.maxHosts)
        this.belongsTo = this.belongsToSubnet(this.address, this.subnets)
    }

    setAddress(address) {
        try {
            let validAddress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)
            let result
            if (validAddress) {
                let firstOctet = parseInt(address.split('.')[0])
                let secondOctet = parseInt(address.split('.')[1])
                let thirdOctet = parseInt(address.split('.')[2])
                let fourthOctet = parseInt(address.split('.')[3])
                result = [firstOctet, secondOctet, thirdOctet, fourthOctet]
            }
            else {
                alert("You have entered an invalid IP address!")
                result = null
            }
            return result
        }
        catch (e) {
            console.log(e)
        }
    }

    setClass(address) {
        try {
            let classA = address[0] >= 1 && address[0] <= 127
            let classB = address[0] >= 128 && address[0] <= 191
            let classC = address[0] >= 192 && address[0] <= 223
            let classD = address[0] >= 224 && address[0] <= 239
            let classE = address[0] >= 240 && address[0] <= 255
            let IPClass
            if (classA) {
                IPClass = 'A'
            }
            else if (classB) {
                IPClass = 'B'
            }
            else if (classC) {
                IPClass = 'C'
            }
            else if (classD) {
                IPClass = 'D'
            }
            else if (classE) {
                IPClass = 'E'
            }
            else {
                IPClass = null
            }
            return IPClass
        }
        catch (e) {
            console.log(e)
        }
    }

    setSubnetMask(borrowedBits) {
        try {
            let maskValue
            let valid = borrowedBits >= 0 && borrowedBits <= 6
            if (valid) {
                borrowedBits === 0 ? maskValue = 0 : maskValue = 2 ** 8 - 2 ** (8 - borrowedBits)
                return [255, 255, 255, maskValue]
            }
            else {
                return null
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    setMaxSubnets(borrowedBits) {
        try {
            let maxSubnets
            let valid = borrowedBits >= 0 && borrowedBits <= 6
            if (valid) {
                borrowedBits === 0 ? maxSubnets = 1 : maxSubnets = 2 ** borrowedBits
            }
            else {
                maxSubnets = null
            }
            return maxSubnets
        }
        catch (e) {
            console.log(e)
        }
    }

    setMaxHosts(borrowedBits) {
        try {
            let maxHosts
            let valid = borrowedBits >= 0 && borrowedBits <= 6
            if (valid) {
                maxHosts = 2 ** (8 - borrowedBits) - 2
            }
            else {
                maxHosts = null
            }
            return maxHosts
        }
        catch (e) {
            console.log(e)
        }
    }

    setNetName(address) {
        try {
            let netName
            netName = [...address]
            netName.splice(3, 1, 0)
            return netName
        }
        catch (e) {
            console.log(e)
        }
    }

    setBroadcast(address) {
        try {
            let broadcast
            broadcast = [...address]
            broadcast.splice(3, 1, 255)
            return broadcast
        }
        catch (e) {
            console.log(e)
        }
    }

    setSubnets(max, netName, numberOfHosts) {
        try {

            let subnets = []
            let host = 0
            for (let number = 0; number < max; number++) {
                let subnetName = [...netName]
                let firstIP = [...netName]
                let lastIP = [...netName]
                let broadcast = [...netName]
                subnetName.splice(3, 1, host)
                firstIP.splice(3, 1, host + 1)
                lastIP.splice(3, 1, host + numberOfHosts)
                broadcast.splice(3, 1, host + 1 + numberOfHosts)
                subnets.push({
                    number,
                    subnetName,
                    firstIP,
                    lastIP,
                    broadcast,
                })
                host = host + numberOfHosts + 2
            }
            return subnets
        }
        catch (e) {
            console.log(e)
        }
    }

    printSubnetsList(subnetNumber) {
        try {
            let messageHead = `
            <table class="table table-hover">
            <thead>
                <tr>
                <th scope="col">Subnet #</th>
                <th scope="col">Name</th>
                <th scope="col">First IP</th>
                <th scope="col">Last IP</th>
                <th scope="col">Broadcast</th>
                </tr>
            </thead>
            <tbody>
            `
            let messageTail = `
            </tbody>
            </table>
            `
            let messageBody = ""
            this.subnets.forEach(sn => {
                messageBody += `
            <tr class=${subnetNumber===sn.number ? "table-info" : ""}>
            <th scope="row">${sn.number}</th>
            <td>${String(sn.subnetName).replaceAll(',', '.')}</td>
            <td>${String(sn.firstIP).replaceAll(',', '.')}</td>
            <td>${String(sn.lastIP).replaceAll(',', '.')}</td>
            <td>${String(sn.broadcast).replaceAll(',', '.')}</td>
            </tr>
            `
            })
            return messageHead + messageBody + messageTail
        }
        catch (e) {
            console.log(e)
        }
    }

    belongsToSubnet(address, subnets) {

        let belongsTo
        subnets.forEach(sn => {
            let itsHere = address[3] >= sn.firstIP[3] && address[3] <= sn.lastIP[3] ||
                address[3] === sn.subnetName[3] || address[3] === sn.broadcast[3]

            if (itsHere) {
                belongsTo = {
                    number: sn.number,
                    name: sn.subnetName
                }
            }
        })
        return belongsTo
    }
}


let buttonSubmit = document.getElementById('buttonSubmit')
buttonSubmit.addEventListener('click', e => {

    let ipAddress = document.getElementById('ip-address').value
    let borrowedBits = document.getElementById('borrowed-bits').value
    let subnetsList = document.getElementById('results')

    let ip = new IPAddress(ipAddress, borrowedBits)
    document.getElementById('subnet-mask').value = String(ip.subnetMask).replaceAll(',', '.')
    document.getElementById('max-subnets').value = String(ip.maxSubnets).replaceAll(',', '.')
    document.getElementById('max-hosts').value = String(ip.maxHosts).replaceAll(',', '.')
    subnetsList.innerHTML = ip.printSubnetsList(ip.belongsTo.number)
    document.getElementById('belongs-to').value = `#${ip.belongsTo.number} (` + String(ip.belongsTo.name).replaceAll(',', '.') + ')'
})


