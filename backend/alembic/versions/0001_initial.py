"""initial schema

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'sessions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('track', sa.Enum('backend', 'system_design', 'security', name='track'), nullable=False),
        sa.Column('difficulty', sa.Enum('junior', 'mid', 'senior', name='difficulty'), nullable=False),
        sa.Column('status', sa.Enum('active', 'completed', name='sessionstatus'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_table(
        'messages',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('session_id', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_table(
        'scores',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('session_id', sa.String(), nullable=False),
        sa.Column('overall_score', sa.Float(), nullable=False),
        sa.Column('recommendation', sa.String(), nullable=False),
        sa.Column('strengths', sa.JSON(), nullable=False),
        sa.Column('improvements', sa.JSON(), nullable=False),
        sa.Column('topic_scores', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['session_id'], ['sessions.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('session_id'),
    )


def downgrade() -> None:
    op.drop_table('scores')
    op.drop_table('messages')
    op.drop_table('sessions')
    op.execute("DROP TYPE IF EXISTS track")
    op.execute("DROP TYPE IF EXISTS difficulty")
    op.execute("DROP TYPE IF EXISTS sessionstatus")
