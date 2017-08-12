activate_this = '/var/www/flaskapps/map_app/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/flaskapps/")


# home points to the home.py file
from map_app import app as application
#application.secret_key = "somesecretsessionkey"
