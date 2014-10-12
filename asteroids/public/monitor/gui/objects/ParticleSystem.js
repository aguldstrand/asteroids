define([

], function(

) {
	function ParticleSystem(size) {
		this.size = size;
		this.pool = [];
		this.particles = [];

		this.___init(size);


	}



	ParticleSystem.prototype.___init = function(size) {
		for (var i = 0; i < size; i++) {
			this.pool.push({
				pos: {
					x: 0,
					y: 0
				},
				vel: {
					x: 0,
					y: 0
				},
				friction: 1,
				gravity: 0,
				life: 10
			});
		}
	};

	ParticleSystem.prototype.update = function(step) {
		var particles = this.particles;

		var verticesList = [];

		var len = particles.length;
		for (var i = 0; i < len; i++) {
			var particle = particles[i];

			if (particle.life < 0) {
				var recycledParticle = particles.splice(i, 1);
				this.pool.push(recycledParticle);
				len--;
				i--;
				continue;
			}

			particle.pos.x += particle.friction * particle.vel.x * step;
			particle.pos.y += (particle.gravity + particle.friction * particle.vel.y) * step;
			particle.life -= step;

			verticesList.push(particle.pos.x, particle.pos.y, particle.pos.x + particle.vel.x, particle.pos.y + particle.vel.y);
		}

		return verticesList;
	};


	ParticleSystem.prototype.add = function(amount, pos, vel, life, gravity, friction) {

		amount = Math.min(this.pool.length - 1, amount);
		life = life || 10;
		gravity = gravity || 1;
		friction = friction || 1;

		for (var i = 0; i < amount; i++) {
			var particle = this.pool.pop();
			particle.pos.x = pos.x;
			particle.pos.y = pos.y;
			particle.vel.x = vel.x * Math.random() - (vel.x * 0.5);
			particle.vel.y = vel.y * Math.random() - (vel.y * 0.5);
			particle.life = life * Math.random() - (life * 0.5);
			particle.friction = friction;
			particle.gravity = gravity;
			this.particles.push(particle);
		}
	};



	return ParticleSystem;
});