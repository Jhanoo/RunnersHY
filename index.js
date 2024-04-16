const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb')
const path = require('path')

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

// body-parser 미들웨어 설정
// app.use(bodyParser.urlencoded({ extended: true }))

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')))

// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// 루트 경로에 대한 GET 요청 처리
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.get('/users', (req, res) => {
    res.sendFile(__dirname + '/users.html')
})

app.post('/users', async (req, res) => {
    try {
        await client.connect() // MongoDB에 연결
        const db = client.db('mydatabase') // 데이터베이스 선택
        const collection = db.collection('users') // 컬렉션 선택

        // 모든 사용자 정보 가져오기
        const users = await collection.find({}).toArray()

        // HTML 형식으로 지원자 정보를 표시
        let html = '<h1>지원자 정보</h1>'
        html += '<table border="1">'
        html += '<tr><th>이름</th><th>학교</th><th>학과</th><th>학번</th><th>전화번호</th><th>성별</th><th>재학여부</th></tr>'
        users.forEach((user) => {
            html += `<tr><td>${user.name}</td><td>${user.university}</td><td>${user.major}</td><td>${user.studentNum}</td><td>${user.phoneNum}</td><td>${user.gender}</td><td>${user.enroll}</td></tr>`
        })
        html += '</table>'

        // 클라이언트에게 HTML 응답 전송
        res.send(html)

        // 가져온 사용자 정보 출력
        // res.json(users)
    } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류:', error)
        res.status(500).send('사용자 정보를 가져오는 중 오류가 발생했습니다.')
    } finally {
        await client.close() // MongoDB 연결 종료
    }
})

// 회원가입 폼 제출 처리
app.post('/signup', async (req, res) => {
    const { name, university, major, studentNum, phoneNum, gender, enroll } = req.body

    try {
        await client.connect()
        const db = client.db('mydatabase') // 데이터베이스 선택
        const collection = db.collection('users') // 컬렉션 선택

        // 회원가입 정보 저장
        await collection.insertOne({
            name,
            university,
            major,
            studentNum,
            phoneNum,
            gender,
            enroll,
        })

        // 사용자가 입력한 정보 콘솔에 출력
        console.log('지원서')
        console.log('이름:', name)
        console.log('학교:', university)
        console.log('학과:', major)
        console.log('학번:', studentNum)
        console.log('전화번호:', phoneNum)
        console.log('성별:', gender)
        console.log('재학 여부:', enroll)

        // 회원가입 완료 페이지로 리다이렉션
        res.redirect('/signup-success')
    } catch (error) {
        console.error('회원가입 정보 저장 중 오류:', error)
        res.status(500).send('회원가입 정보를 저장하는 중 오류가 발생했습니다.')
    } finally {
        await client.close() // MongoDB 연결 종료
    }
})

// 회원가입 완료 페이지 라우트
app.get('/signup-success', (req, res) => {
    res.send('지원서 작성이 완료되었습니다!')
})

// 서버 시작
const port = 3000
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`)
})
