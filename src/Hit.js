// Collision 
msw.Hit = cc.Class.extend 
({
	ctor:function ( )
	{
		this.l = 0;
		this.r = 0;
		this.t = 0;
		this.b = 0;
	},

	ctor:function ( l, r, b, t )
	{		
		this.l = l;
		this.r = r;
		this.t = t;
		this.b = b;
	},

	Clone:function ( )
	{
		return new msw.Hit ( this.l, this.r, this.b, this.t );
	},
	
	IsHit:function ( x, y, op, ox, oy )
	{
		if ( ox === undefined )
		{
			ox = 0;
		}

		if ( oy === undefined )
		{
			oy = 0;
		}	
		
		var 	l = x + this.l;
		var		t = y + this.t;
		var 	r = x + this.r;
		var		b = y + this.b;
		
		var 	opl = ox + op.l;
		var		opt = oy + op.t; 
		var		opr = ox + op.r;
		var		opb = oy + op.b;
		
		if ( l == r || t == b || opl == opr || opt == opb )
		{
			return false;
		}
		
		return !( r <= opl || opr <= l || t <= opb || opt <= b );
	},
	
	IsInside:function ( x, y, op, ox, oy )
	{
		if ( ox === undefined )
		{
			ox = 0;
		}
		
		if ( oy === undefined )
		{
			oy = 0;
		}		
		
		var		l = x + this.l;
		var		t = y + this.t; 
		var		r = x + this.r;
		var		b = y + this.b;
		
		var 	opl = ox + op.l;
		var		opt = oy + op.t; 
		var		opr = ox + op.r;
		var		opb = oy + op.b;
		
		return ( opl <= l && r <= opr && opb <= b && t <= opt );		
	},
	
	IsVoid:function ( )
	{
		return this.l == this.r || this.t == this.b;
	},
	
	SetPos:function ( x, y )
	{
		this.l += x;
		this.r += x; 
		this.t += y; 
		this.b += y; 
	},
});

msw.GetHitFromFrame = function ( Frame )
{
	return new msw.Hit ( -Frame.width / 2, Frame.width / 2, -Frame.height / 2, Frame.height / 2 );
};