const assert = require('assert');
const sinon = require('sinon');
const mocha = require('mocha');

const managerService = require('./../service/ManagerService');

const manService = new managerService();

let DAO = {
    listCustomerData: function () {
        return [{
            "_id": '11',
            "name": 'Name1',
            "email": "example@example.com",
            "address": "This street, That road",
            "phone": "012345678",
            "orderIDs": [
                {
                    "OrderID": "1111",
                    "status": "Order Accepted"
                }
            ]
        }]
    }
};

describe("Manager service List all order test", function () {
    it("It should return 'No orders found' when nothing was ordered by the customers", function () {
        manService.listAllOrders((success) => {

        }, (err) => {
            assert.strictEqual("No orders found", err);
        })
    });
    it("It should return with the order ids when they are existing", function () {
        const manService = new managerService(DAO);
        const expBody = [
            {
                "OrderID": "1111",
                "status": "Order Accepted"
            }
        ];
        manService.listAllOrders((success) => {
            assert.strictEqual(success, expBody)
        })
    })
});