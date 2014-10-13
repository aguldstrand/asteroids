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
				life: 10,
				target: {
					x: 0,
					y: 0
				}
			});
		}
	};

	ParticleSystem.prototype.update = function(step) {
		var particles = this.particles;

		var verticesList = [];

		var len = particles.length;
		for (var i = 0; i < len; i++) {
			var particle = particles[i];

			if (particle.pos.x - particle.target.x < 25 && particle.pos.y - particle.target.y < 25 || particle.life < 0) {
				var recycledParticle = particles.splice(i, 1)[0];
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


	ParticleSystem.prototype.add = function(amount, pos, spread, life) {

		amount = Math.min(this.pool.length - 1, amount);
		life = life || 10;
		//gravity = gravity || 1;
		//friction = friction || 1;

		for (var i = 0; i < amount; i++) {
			var particle = this.pool.pop();



			//var velX = Math.random() * spread - (spread * 0.5);
			//var velY = Math.random() * spread - (spread * 0.5);
			var p = this.___normalize({
				x: Math.random() * spread - (spread * 0.5),
				y: Math.random() * spread - (spread * 0.5)
			}, spread + Math.random() * spread * 0.22);


			particle.pos.x = pos.x + p.x * -100;
			particle.pos.y = pos.y + p.y * -100;
			particle.vel.x = p.x;
			particle.vel.y = p.y;
			particle.life = life;

			this.particles.push(particle);
		}

	};

	ParticleSystem.prototype.___normalize = function(p, len) {
		var mag = Math.sqrt(p.x * p.x + p.y * p.y);

		p.x = p.x / mag;
		p.y = p.y / mag;

		p.x *= len;
		p.y *= len;

		return p;
	};



	return ParticleSystem;
});