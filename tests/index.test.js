import hitoApi from '../src/scripts/api/hitoApi'

describe('test call api ok', function () {
	test('test login - success', async function () {
		let dataObj = {
			success: true,
			data: true
		}
		let mockedAxios = {
			async get() { return Promise.resolve(dataObj) },
			async post() { return Promise.resolve(dataObj) },
		}

		const result = (await hitoApi.login({ axios: mockedAxios }))
		expect(result).toBe(dataObj.data);
	})
	test('test login - fail - exception occursion', async function () {
		let err = { 'exception': 'testException' }
		let mockedAxios = {
			async get() { return Promise.reject(err) },
			async post() { return Promise.reject(err) },
		}

		hitoApi.login({ axios: mockedAxios })
			.catch(e => expect(e).toBe(err));
	})

	test('test login kintai - success', async function () {
		let dataObj = {
			success: true,
			data: true
		}
		let mockedAxios = {
			async get() { return Promise.resolve(dataObj) },
			async post() { return Promise.resolve(dataObj) },
		}

		const result = (await hitoApi.loginKintai({ axios: mockedAxios }))
		expect(result).toBe(dataObj.data);
	})

	test('test login kintai - fail - exception occursion', async function () {
		let err = { 'exception': 'testException' }
		let mockedAxios = {
			async get() { return Promise.reject(err) },
			async post() { return Promise.reject(err) },
		}

		hitoApi.loginKintai({ axios: mockedAxios })
			.catch(e => expect(e).toBe(err));
	})

	test('test get kintai status - success', async function () {
		let dataObj = {
			success: true,
			data: true
		}
		let mockedAxios = {
			async get() { return Promise.resolve(dataObj) },
			async post() { return Promise.resolve(dataObj) },
		}

		const result = (await hitoApi.getKintaiStatus({ axios: mockedAxios }))
		expect(result).toBe(dataObj.data);
	})


	test('test get kintai status - fail - exception occursion', async function () {
		let err = { 'exception': 'testException' }
		let mockedAxios = {
			async get() { return Promise.reject(err) },
			async post() { return Promise.reject(err) },
		}

		hitoApi.getKintaiStatus({ axios: mockedAxios })
			.catch(e => expect(e).toBe(err));
	})

	test('test change kintai status - success', async function () {
		let dataObj = {
			success: true,
			data: true
		}
		let mockedAxios = {
			async get() { return Promise.resolve(dataObj) },
			async post() { return Promise.resolve(dataObj) },
		}

		const result = (await hitoApi.changeKintaiStatus({ axios: mockedAxios }))
		expect(result).toBe(dataObj.data);
	})

	test('test change kintai status - fail - already logged in', async function () {
		let err = {
			response: { status: 403 }
		}
		let mockedAxios = {
			async get() { return Promise.reject(err) },
			async post() { return Promise.reject(err) },
		}

		const result = (await hitoApi.changeKintaiStatus({ axios: mockedAxios }))
		expect(result.success).toBe(true);
		expect(result.data).toBe(null);
	})

	test('test change kintai status - fail - exception occursion', async function () {
		let err = {
			response: { status: 404 }
		}
		let mockedAxios = {
			async get() { return Promise.reject(err) },
			async post() { return Promise.reject(err) },
		}

		hitoApi.changeKintaiStatus({ axios: mockedAxios })
			.catch(e => expect(e).toBe(err));
	})
})