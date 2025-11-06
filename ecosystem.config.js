module.exports = {
    apps: [
        {
            name: 'milk_vendor_api',
            script: 'bin/www',
            env_production: {
                NODE_ENV: 'production'
            },
        }
    ],
    deploy: {
        "production": {
            "user": "ubuntu",
            "host": "56.155.114.153",
            "ref": "origin/master",
            "repo": "git@bitbucket.org:dairy-inventory/milk-vendor.git ",
            "path": "/home/ubuntu/milk_vendor_api",
            "pre-deploy": "echo 'This is executed before deployment'",
            "post-deploy": "cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.config.js --env production"
        }
    }
}