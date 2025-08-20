--
-- Name: authentication; Type: SCHEMA; Schema: -; Owner: ratts
--

CREATE SCHEMA authentication;

ALTER SCHEMA authentication OWNER TO ratts;

--
-- Name: user_status; Type: TYPE; Schema: authentication; Owner: ratts
--

CREATE TYPE authentication.user_status AS ENUM (
    'active',
    'suspended',
    'deleted'
);

CREATE TABLE authentication."user" (
    id BIGSERIAL PRIMARY KEY,
    email TEXT CHECK (char_length(email) <= 254) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status authentication.user_status DEFAULT 'active'::authentication.user_status NOT NULL,
    create_ts timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_ts timestamp with time zone
);
