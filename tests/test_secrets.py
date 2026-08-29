import base64

from regie.secrets import load_secrets, mint, mosquitto_hash


def test_mosquitto_hash_shape_and_determinism():
    a = mosquitto_hash("pw", "alice")
    scheme, iterations, salt, key = a[1:].split("$")
    assert (scheme, iterations) == ("7", "101")
    assert len(base64.b64decode(salt)) == 12 and len(base64.b64decode(key)) == 64
    assert a == mosquitto_hash("pw", "alice"), "the same secret renders the same bytes"
    assert a != mosquitto_hash("pw", "bob") and a != mosquitto_hash("other", "alice")


def test_mint_shapes():
    assert len(mint("zigbee_main_network_key")) == 16
    assert len(mint("zigbee_main_ext_pan_id")) == 8
    assert 1 <= mint("zigbee_main_pan_id") <= 0xFFFE
    assert isinstance(mint("mqtt_password_home"), str) and len(mint("mqtt_password_home")) >= 24


def test_environment_overrides_the_file(tmp_path):
    f = tmp_path / "s.yml"
    f.write_text("mqtt_password_home: from-file\nzigbee_main_pan_id: 1\n")
    env = {
        "REGIE_SECRET_MQTT_PASSWORD_HOME": "from-env",
        "REGIE_SECRET_ZIGBEE_MAIN_NETWORK_KEY": "[1, 2, 3]",
        "HOME": "/x",
    }
    values = load_secrets(f, environ=env)
    assert values == {
        "mqtt_password_home": "from-env",
        "zigbee_main_pan_id": 1,
        "zigbee_main_network_key": [1, 2, 3],
    }
