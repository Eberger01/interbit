const path = require('path')
const chainAliases = require('./src/constants/chainAliases')

const PUB_KEY =
  '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v2.6.2\r\nComment: https://openpgpjs.org\r\n\r\nxk0EWtpPiAEB/1DUOOu08SW7IGGlw5AavcxUxtrJbJVliIcFNSTpn/z/p0Zi\nIfO58AK0dfcHyMb1vUY8zwM45if6iaNS98zF3lEAEQEAAc0NPGluZm9AYnRs\nLmNvPsJ1BBABCAApBQJa2k+IBgsJBwgDAgkQjFLIxmtXVSMEFQgKAgMWAgEC\nGQECGwMCHgEAAIdvAf0SbWcBMphrR7wc6rL5ytyThLBsI72vz/0QyBcaRlsp\nQ9US66w6f+OWcpAiOeLDdx9l39difSXpjL9yYWxWRElSzk0EWtpPiAECAOpL\nfIIdC5S/lIaWI+Bx23FtSdxyqrKduDQCRDhB07udTv4bjGCSCtpyPS3Y03m6\nyl/GAa7OLIFeLzI4tzT0CXMAEQEAAcJfBBgBCAATBQJa2k+ICRCMUsjGa1dV\nIwIbDAAAxXwB/RUA88XTd6vDJDFeRx4/Escv5tyQuT9bxMkmSxaqiBRTU2X5\nhrFQs5NGOu2ySGbRvZMopK91sLK/uqlTaty1oVk=\r\n=yws5\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n'

const config = {
  peers: [],
  adminValidators: [PUB_KEY],
  staticChains: {
    [chainAliases.CONTROL]: {
      applyInterbuffer: true,
      covenant: 'app-account-control',
      config: {
        validators: [PUB_KEY],
        joins: {
          provide: [
            {
              alias: chainAliases.PUBLIC,
              path: ['privateChainHosting', 'shared'],
              joinName: 'HOSTING_SPONSOR'
            }
          ]
        }
      }
    },
    [chainAliases.PUBLIC]: {
      covenant: 'app-account-public',
      config: {
        validators: [PUB_KEY],
        joins: {
          consume: [
            {
              alias: chainAliases.GITHUB,
              path: ['identityProviders', 'oauth', 'gitHub'],
              joinName: 'OAUTH-CONFIG-GITHUB'
            },
            {
              alias: chainAliases.CONTROL,
              path: ['privateChainHosting'],
              joinName: 'HOSTING_SPONSOR'
            }
          ]
        }
      }
    },
    [chainAliases.GITHUB]: {
      covenant: 'app-account-github-kyc',
      config: {
        validators: [PUB_KEY],
        joins: {
          provide: [
            {
              alias: chainAliases.PUBLIC,
              path: ['oAuth', 'shared'],
              joinName: 'OAUTH-CONFIG-GITHUB'
            }
          ]
        }
      }
    }
  },
  covenants: {
    'app-account-my-account': {
      location: path.join(__dirname, 'src/interbit/my-account')
    },
    'app-account-public': {
      location: path.join(__dirname, 'src/interbit/public')
    },
    'app-account-control': {
      location: path.join(__dirname, 'src/interbit/control')
    },
    'app-account-github-kyc': {
      location: path.join(__dirname, 'src/interbit/github-kyc')
    }
  },
  apps: {
    account: {
      peers: ['localhost:5025'], // the peers the browser should connect to
      chains: [chainAliases.PUBLIC], // the chains that need to load in the browser
      appChain: chainAliases.PUBLIC, // The chain that the static page is loaded on
      indexLocation: path.join(__dirname, 'public/index.html'), // the index.html to update with the app info
      buildLocation: path.join(__dirname, 'build/') // the location of the finished build to update
    }
  }
}

module.exports = config
