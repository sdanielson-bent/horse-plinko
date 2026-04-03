class GameRenderer {
    constructor(canvas, physicsEngine) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.physics = physicsEngine;

        const { width, height } = this.physics.getDimensions();
        this.canvas.width = width;
        this.canvas.height = height;

        this.slotLabels = ['Low', 'Med-', 'Med', 'Med+', 'MULTI!', 'Med+', 'Med', 'Med-', 'High'];
        this.slotValues = [1, 2, 5, 10, 20, 10, 5, 2, 50];
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderPegs();
        this.renderWalls();
        this.renderSlots();
        this.renderDroppingObjects();

        requestAnimationFrame(() => this.render());
    }

    renderPegs() {
        this.ctx.fillStyle = '#4A5568';
        this.ctx.strokeStyle = '#2D3748';
        this.ctx.lineWidth = 1;

        this.physics.pegs.forEach(peg => {
            this.ctx.beginPath();
            this.ctx.arc(peg.position.x, peg.position.y, this.physics.pegRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    renderWalls() {
        this.ctx.fillStyle = '#2D3748';

        this.physics.walls.forEach(wall => {
            const { x, y } = wall.position;
            const width = wall.bounds.max.x - wall.bounds.min.x;
            const height = wall.bounds.max.y - wall.bounds.min.y;

            this.ctx.fillRect(
                wall.bounds.min.x,
                wall.bounds.min.y,
                width,
                height
            );
        });
    }

    renderSlots() {
        const slotWidth = this.canvas.width / 9;
        const slotY = this.canvas.height - 60;

        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i < 9; i++) {
            const x = i * slotWidth;

            this.ctx.fillStyle = i === 4 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(102, 126, 234, 0.1)';
            this.ctx.fillRect(x, slotY - 25, slotWidth, 50);

            this.ctx.strokeStyle = i === 4 ? '#FFD700' : '#667eea';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, slotY - 25, slotWidth, 50);

            this.ctx.fillStyle = i === 4 ? '#FF8C00' : '#667eea';
            this.ctx.fillText(this.slotLabels[i], x + slotWidth / 2, slotY - 10);

            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillStyle = '#666';
            this.ctx.fillText(`${this.slotValues[i]}`, x + slotWidth / 2, slotY + 10);
            this.ctx.font = 'bold 14px Arial';
        }

        this.ctx.fillStyle = '#CBD5E0';
        for (let i = 1; i < 9; i++) {
            const x = i * slotWidth;
            this.ctx.fillRect(x - 1, slotY - 25, 2, 50);
        }
    }

    renderDroppingObjects() {
        this.physics.droppingBodies.forEach(body => {
            const { x, y } = body.position;
            const config = body.config;

            if (config.emoji) {
                this.ctx.font = `${config.radius * 2}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(config.emoji, x, y);
            } else {
                const gradient = this.ctx.createRadialGradient(
                    x - config.radius / 3,
                    y - config.radius / 3,
                    0,
                    x,
                    y,
                    config.radius
                );
                gradient.addColorStop(0, this.lightenColor(config.color, 40));
                gradient.addColorStop(1, config.color);

                this.ctx.fillStyle = gradient;
                this.ctx.strokeStyle = config.render.strokeStyle;
                this.ctx.lineWidth = config.render.lineWidth;

                this.ctx.beginPath();
                this.ctx.arc(x, y, config.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            }
        });
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }

    start() {
        this.render();
    }
}
