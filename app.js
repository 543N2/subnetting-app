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
    }

    setAddress(address) {
        let firstOctet = parseInt(address.split('.')[0])
        let secondOctet = parseInt(address.split('.')[1])
        let thirdOctet = parseInt(address.split('.')[2])
        let fourthOctet = parseInt(address.split('.')[3])
        return [firstOctet, secondOctet, thirdOctet, fourthOctet]
    }

    setClass(address) {
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

    setSubnetMask(borrowedBits) {
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

    setMaxSubnets(borrowedBits) {
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

    setMaxHosts(borrowedBits) {
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

    setNetName(address) {
        let netName
        netName = [...address]
        netName.splice(3, 1, 0)
        return netName
    }

    setBroadcast(address) {
        let broadcast
        broadcast = [...address]
        broadcast.splice(3, 1, 255)
        return broadcast
    }

    setSubnets(max, netName, numberOfHosts) {
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

    printSubnets() {
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
            <tr>
            <th scope="row">${sn.number}</th>
            <td>${sn.subnetName}</td>
            <td>${sn.firstIP}</td>
            <td>${sn.lastIP}</td>
            <td>${sn.broadcast}</td>
            </tr>
            `
        })
        return messageHead + messageBody + messageTail
    }
}

let buttonSubmit = document.getElementById('buttonSubmit')

buttonSubmit.addEventListener('click', e => {

    let ipInput = document.getElementById('ip-address').value
    let borrowedBitsInput = document.getElementById('borrowed-bits').value
    let printer = document.getElementById('results')
    let ip = new IPAddress(ipInput, borrowedBitsInput)
    printer.innerHTML = ip.printSubnets()
})