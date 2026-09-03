from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://mockmate:mockmate@localhost:5432/mockmate"
    anthropic_api_key: str

    model_config = {"env_file": ".env"}


settings = Settings()
