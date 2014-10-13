define([
	'hektorskraffs/webgl',
], function(
	WebGL
) {
	function ParticleSystem(size, color) {
		this.size = size;
		this.pool = [];
		this.particles = [];

		this.___init(size);
		this.color = color || [1, 0.0, 1.0, 1];


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
				vmultip: 1
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
				var recycledParticle = particles.splice(i, 1)[0];
				this.pool.push(recycledParticle);
				len--;
				i--;
				continue;
			}

			particle.pos.x += particle.friction * particle.vel.x * step;
			particle.pos.y += (particle.gravity + particle.friction * particle.vel.y) * step;
			particle.life -= step;


			verticesList.push(particle.pos.x, particle.pos.y, particle.pos.x + particle.vel.x * particle.vmultip, particle.pos.y + particle.vel.y * particle.vmultip);
		}

		return verticesList;
	};


	ParticleSystem.prototype.add = function(amount, pos, vel, life, gravity, friction, vmultip) {

		amount = Math.min(this.pool.length - 1, amount);
		life = life || 10;
		gravity = gravity || 1;
		friction = friction || 1;
		vmultip = vmultip || 1;

		for (var i = 0; i < amount; i++) {
			var particle = this.pool.pop();

			var p = this.___normalize({
				x: vel.x * Math.random() - (vel.x * 0.5),
				y: vel.y * Math.random() - (vel.y * 0.5)
			}, vel.x + vel.y);

			particle.pos.x = pos.x;
			particle.pos.y = pos.y;
			particle.vel.x = p.x;
			particle.vel.y = p.y;
			particle.vmultip = vmultip;
			particle.life = life * Math.random() - (life * 0.5);
			particle.friction = friction;
			particle.gravity = gravity;
			this.particles.push(particle);
		}

	};

	ParticleSystem.prototype.draw = function(program, vertices) {

		if (vertices.length === 0) {
			return;
		}
		var vertPol = WebGL.createPolygon(vertices);

		var uniforms = program.uniforms;

		var positionLocation = uniforms.u_position;
		var rotationLocation = uniforms.u_rotation;
		var scaleLocation = uniforms.u_scale;



		var gl = WebGL.gl;



		WebGL.bindAttribBuffer(vertPol.vertexBuffer, program.attributes.a_position, vertPol.itemSize);

		WebGL.bindUniform(uniforms.u_color, this.color);

		//window.tracker.outFixed(s, epp[s].x + ' ' + epp[s].y + ' ' + epp[s].r);

		gl.uniform2f(positionLocation, 0, 0);
		gl.uniform1f(rotationLocation, 0);
		gl.uniform2f(scaleLocation, 1, 1);


		gl.drawArrays(gl.LINES, 0, vertPol.vertexCount);


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