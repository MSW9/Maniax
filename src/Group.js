// Object Group
msw.Group = cc.Layer.extend
({
	ctor:function ( Manager, NumAllObject )
	{
		this._super ( );
		
		this.Manager 		 = Manager;
		
		this.NumAllObjects 	 = NumAllObject;
		this.NumFreeObjects	 = 0;
		this.NumUsedObjects  = 0;
		
		this.AllObjects		 = [];
		this.FreeObjects	 = [];
		this.UsedObjects	 = [];
		this.LockedObjects	 = [];
		
		this.ScreenHit		 = null;
		this.DeadzoneHit	 = null;
		this.Input			 = null;
		
		this.HitIndex		 = 0;
		this.CollisionEnergy = 0;
		
		this.Speed			 = 0;
		this.SpeedTime		 = 0;	
		
		for ( var i = 0; i < this.NumAllObjects; i++ )
		{
			this.AllObjects [ i ] = new msw.Object ( this );
		}		
		this.Clear ( );		
	},
	
	Create:function ( )
	{
		if ( this.NumFreeObjects == 0 )
		{
			return null;
		}
		
		--this.NumFreeObjects;
		
		var 	obj = this.FreeObjects [ this.NumFreeObjects ];
		obj.Used = true;				
		
		return obj;		
	},
	
	Remove:function ( obj )
	{
		this.FreeObjects [ this.NumFreeObjects++ ] = obj;
		obj.Used = false;	
		
		if ( obj.Sprite )
		{
			this.removeChild ( obj.Sprite );
			obj.Sprite = null;
		}		
	},
	
	Clear:function ( )
	{
		for ( var i = 0; i < this.NumAllObjects; i++ )
		{
			var 	obj = this.AllObjects [ i ];
			this.FreeObjects [ i ] = obj;
			obj.Used = false;
			
			if ( obj.Sprite )
			{
				this.removeChild ( obj.Sprite );
				obj.Sprite = null;
			}					
		}
		
		for ( var i = 0; i < msw.MAX_LOCKS; i++ )
		{
			this.LockedObjects [ i ] = null;
		}
		this.NumFreeObjects  = this.NumAllObjects;
		this.NumUsedObjects  = 0;
		this.CollisionEnergy = 0;
		this.Speed = this.SpeedTime = 0;
	},
	
	Check:function ( )
	{
		this.NumUsedObjects = 0;
		
		for ( var i = 0; i < this.NumAllObjects; i++ )
		{
			var 	obj = this.AllObjects [ i ];
			if ( obj.Used )
			{
				this.UsedObjects [ this.NumUsedObjects++ ] = obj;
			}
		}

		for ( var i = 0; i < msw.MAX_LOCKS; i++ )
		{
			var 	obj = this.LockedObjects [ i ];
			if ( obj && obj.Dead )
			{
				obj.RefCount--;
				this.LockedObjects [ i ] = null;
			}
		}
		
		for ( var i = 0; i < this.NumUsedObjects; i++ )
		{
			this.UsedObjects [ i ].Check ( );
		}		
	},
	
	Update:function ( )
	{
		if ( this.Speed >= 0 || this.SpeedTime == 0 )
		{
			for ( var n = ( this.Speed > 0 ? this.Speed : 0 ); n >= 0; n-- )
			{
				for ( var i = 0; i < this.NumUsedObjects; i++ )
				{
					this.UsedObjects [ i ].Update ( );
				}
			}
		}
		this.SpeedTime--;
		if ( this.SpeedTime < 0 )
		{
			this.SpeedTime = -this.Speed;
		}
		this.CollisionEnergy--;		
	},
	
	PostUpdate:function ( )
	{
		for ( var i = 0; i < this.NumUsedObjects; i++ )
		{
			this.UsedObjects [ i ].PostUpdate ( );
		}
	},
	
	FirstUsed:function ( )
	{
		this.HitIndex = 0;
		return this.NextUsed ( );
	},
	
	NextUsed:function ( )
	{
		for ( ; this.HitIndex < this.NumUsedObjects; this.HitIndex++ )
		{
			var		obj = this.UsedObjects [ this.HitIndex ];
			if ( !obj.Dead )
			{
				this.HitIndex++;
				return obj;
			}
		}
		
		return null;
	},
	
	FirstHit:function ( Hit )
	{
		this.HitIndex = 0;
		return this.NextHit ( Hit );
	},
	
	NextHit:function( Hit )
	{
		for ( ; this.HitIndex < this.NumUsedObjects; this.HitIndex++ )
		{
			var		obj = this.UsedObjects [ this.HitIndex ];
			if ( !obj.Dead && obj.Frame && msw.GetHitFromFrame ( obj.Frame ).isHit ( obj.X, obj.Y, Hit ) )
			{
				this.HitIndex++;
				return obj;
			}
		}
		
		return null;
	},
	
	FirstInside:function ( Hit )
	{
		this.HitIndex = 0;
		return this.NextInside ( Hit );
	},
	
	NextInside:function ( Hit )
	{
		for ( ; this.HitIndex < this.NumUsedObjects; this.HitIndex++ )
		{
			var		obj = this.UsedObjects [ this.HitIndex ];
			if ( !obj.Dead && obj.Frame && Hit.IsInside ( 0, 0, msw.GetHitFromFrame ( obj.Frame ), obj.X, obj.Y ) )
			{
				this.HitIndex++;
				return obj;
			}
		}
		
		return null;
	},	
	
	GetUsed:function ( )
	{
		return this.UsedObjects; 
	},
	
	GetUsed:function ( )
	{
		return this.NumUsedObjects; 
	},
	
	GetNumFree:function ( )
	{
		return this.NumFreeObjects; 
	},
	
	GetManager:function ( )
	{
		return this.Manager; 
	},
	
	GetRandomUsedObject:function ( )
	{
		if ( this.NumUsedObjects == 0 )
		{
			return null;
		}
		
		var 	r = parseInt ( Math.random ( ) * this.NumUsedObjects );
		return this.UsedObjects [ r ];
	},
	
	GetLockedObject:function ( ID )
	{
	 	return this.LockedObjects [ ID ];
	},
	
	ClearLockedObject:function ( )
	{
		/*
		for (int i=0; i<MAX_LOCKS; i++) {
			CMover* mover=LockedObjects[i];
			if (mover) mover->RefCount--;
			LockedObjects[i]=NULL;
		}
		*/		
	},	
	
	CheckDamage:function ( Group, Mode )
	{
		for ( var i = 0; i < this.NumAllObjects; i++ )
		{
			var 	mi = this.AllObjects [ i ];
			if ( mi.Used && !mi.Dead && !mi.Damage.Transparent )
			{
				for ( var j = 0; j < Group.NumAllObjects; j++ ) 
				{
					mj = Group.AllObjects [ j ];
					
					if ( mj.Damage.TargetOnly && mj.Target.Model != mi )
					{
						continue;
					}
					if ( mi.Damage.TargetOnly && mi.Target.Model != mj )
					{
						continue;
					}
					if ( mj.Used && !mj.Dead && !mj.Damage.Transparent &&
						 mj.Damage.Hit.IsHit ( mj.X, mj.Y, mi.Damage.Hit, mi.X, mi.Y ) )
					{					
						if ( !mi.Damage.Invincible && ( mi.Color == 0 || mi.Color != mj.Color ) )
						{
							mi.Damage.Vit -= mj.Damage.Str;
						}
						if ( mj.Valid.Lock ) 
						{
							mi.Group.LockedObjects [ mj.Lock.ID ] = mi;
							mi.RefCount++;
						}
						if ( this.Mode == msw.DAMAGE_BOTH )
						{
							if ( !mj.Damage.Invincible )
							{
								mj.Damage.Vit -= mi.Damage.Str;
							}
							if ( mi.Valid.Lock ) 
							{
								mj.Group.LockedObjects [ mi.Lock.ID ] = mj;
								mj.RefCount++;
							}
						}
					}
				}
			}
		}		
	},
	
	GetScreenHit:function ( )
	{
		return this.ScreenHit;
	},
	
	SetScreenHit:function ( Hit )
	{
		this.ScreenHit = Hit;
	},

	GetDeadzoneHit:function ( )
	{
		return this.DeadzoneHit;
	},
	
	SetDeadzoneHit:function ( Hit )
	{
		this.DeadzoneHit = Hit;
	},
	
	GetInput:function ( )
	{
		return this.Input;
	},

	SetInput:function ( Input )
	{
		this.Input = Input;
	},
	
	GetCollisionEnergy:function ( )
	{
		return this.CollisionEnergy; 
	},
	
	IncreaseCollisionEnergy:function ( )
	{
		this.CollisionEnergy += 2; 
	},
	
	GetSpeed:function ( ) 
	{
		return this.Speed; 
	},
	
	SetSpeed:function ( Speed )
	{
		this.Speed = Speed; 
	}	
});
