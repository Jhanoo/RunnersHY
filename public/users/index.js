const { MongoClient, ServerApiVersion } = require('mongodb')

// mongodb+srv://jhanoo15:hanoo1541@runnershy-cluster.fxsr8l8.mongodb.net/

// MongoDB 연결 정보
const uri = 'mongodb+srv://jhanoo15:hanoo1541@runnershy-cluster.fxsr8l8.mongodb.net/'
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

const users = []
const tbody = document.querySelector('tbody')

try {
    await client.connect() // MongoDB에 연결
    const db = client.db('mydatabase') // 데이터베이스 선택
    const collection = db.collection('users') // 컬렉션 선택

    // 모든 사용자 정보 가져오기
    const users = await collection.find({}).toArray()

    users.forEach((user) => {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.university}</td>
        <td>${user.major}</td>
        <td>${user.studentNum}</td>
        <td>${user.phoneNum}</td>
        <td>${user.gender}</td>
        <td>${user.enroll}</td>
        `

        tbody.appendChild(tr)
    })
} catch (error) {
    console.error('사용자 정보를 가져오는 중 오류:', error)
} finally {
    await client.close() // MongoDB 연결 종료
}
