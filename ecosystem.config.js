module.exports = {
    apps: [
        {
            name: 'milk_vendor_api',
            script: 'app.js',
            instances: 1,
            autorestart: true,
            watch: true,
            env_production: {
                NODE_ENV: 'production'
            },
        }
    ],
    deploy: {
        "production": {
            "user": "ubuntu",
            "host": "56.155.114.153",
            "ref": "origin/main",
            "repo": "https://github.com/sanuitservices-pixel/milk-vendor-git.git",
            "path": "/home/ubuntu/deploy",
            "pre-deploy": "echo 'This is executed before deployment'",
            "post-deploy": "cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.config.js --env production"
        }
    }
}