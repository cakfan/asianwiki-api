const express = require('express')
const router = express.Router()
const { getData } = require('./asianwiki')

/* GET asianwiki page. */
router.get('/', function (req, res, next) {
  getData(req, res)
})

router.get('/detail/', function (req, res, next) {
  res.status(400).json({
    status: 'error',
    message: 'Please provide an Asianwiki path'
  })
})

router.get('/detail/:path', function (req, res, next) {
  getData(req, res)
})

module.exports = router
