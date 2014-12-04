msw.HIT_ALL	 = 0;
msw.HIT_CORE = 1;

msw.Frame = cc.Class.extend
({
	ctor:function ( Name, Number )
	{
		this.Name 		= Name; 
		this.Number		= Number;
		this.Frames		= [];
		this.Hits		= [];
		
//		cc.log ( this.Name + ", " + this.Number );
		
		var		size = this.Get ( ).getOriginalSize ( );
		
		var		w2 = size.width  * 0.5;
		var		h2 = size.height * 0.5;
		
		this.Hits [ msw.HIT_ALL  ] = new msw.Hit ( -w2, w2, -h2, h2 );
		
		w2 *= 0.5;
		h2 *= 0.5;
		
		this.Hits [ msw.HIT_CORE ] = new msw.Hit ( -w2, w2, -h2, h2 );
	},
	
	Get:function ( Index )
	{
		if ( Index === undefined )
		{
			Index = 0;
		}
		
		var		Name = this.Name;
		if ( !( this.Number === undefined ) )
		{
			Name += "." + Index;
		}
		
		return cc.spriteFrameCache.getSpriteFrame ( Name );
	},
	
	Count:function ( )
	{
		if ( this.Number === undefined )
		{
			return 1;
		}
		
		return this.Number;
	},
	
	// Hit
	SetCoreHitWithRatio:function ( RatioX, RatioY )
	{
		var		rw2 = ( this.Hits [ msw.HIT_ALL ].r - this.Hits [ msw.HIT_ALL ].l ) * RatioX * 0.5;
		var		rh2 = ( this.Hits [ msw.HIT_ALL ].t - this.Hits [ msw.HIT_ALL ].b ) * RatioY * 0.5;
		
		this.Hits [ msw.HIT_CORE ].l = -rw2; 
		this.Hits [ msw.HIT_CORE ].r =  rw2; 
		this.Hits [ msw.HIT_CORE ].b = -rh2; 
		this.Hits [ msw.HIT_CORE ].t =  rh2; 		
	},
	
	SetHit:function ( Type, Hit )
	{
		this.Hits [ Type ].l = Hit.l;
		this.Hits [ Type ].r = Hit.r;
		this.Hits [ Type ].b = Hit.b;
		this.Hits [ Type ].t = Hit.t;
	},
	
	GetHit:function ( Type )
	{
		return new msw.Hit ( this.Hits [ Type ].l, this.Hits [ Type ].r, this.Hits [ Type ].b, this.Hits [ Type ].t );
	},
});