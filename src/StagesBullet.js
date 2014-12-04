msw.MakeStagesBullet = function ( Game )
{
	var 	sg = Game.GroupMgr.GetGroup ( msw.GROUP_STAGE  );
	var	 	eg = Game.GroupMgr.GetGroup ( msw.GROUP_ENEMY  );
	var	 	bg = Game.GroupMgr.GetGroup ( msw.GROUP_BULLET );
	
	var		pos = { x : cc.winSize.width / 2, y : cc.winSize.height - msw.MARGIN + msw.DEADZONE * 0.5 };
	
	//-------------------------------------------------------
	// Aiming Bullet
	var		bullet = new msw.Object ( bg );
	bullet.SetFrame ( "projectile.blood" );
	bullet.SetAiming ( 4, 0 );
	bullet.SetYaw ( 0.05 );		
	bullet.SetPos ( 0, -15 );

	// Enemy
	var		enemy = new msw.Object ( eg );
	enemy.SetFrame ( "enemy.small" );
	enemy.SetAiming ( 2, 0 );
	enemy.SetAutoYaw ( );			
	enemy.AddSpawn ( bullet, 0, 30, -1 );	

	// Stage
	var		stage = new msw.Object ( sg );
	stage.SetPos ( pos.x, pos.y );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawn ( enemy, 1, 80, -1 );	

	Game.AddStage ( stage, "Aiming Bullet", "Bullets move to main character." );	

	//-------------------------------------------------------
	// Aiming Bullet 2
	var		bullet1 = new msw.Object ( bg );
	bullet1.SetFrame ( "projectile.blood" );
	bullet1.SetAiming ( 4, 0 );
	bullet1.SetYaw ( 0.05 );		
	
	var		bullet2 = new msw.Object ( bg );
	bullet2.SetFrame ( "projectile.brightball" );
	bullet2.SetAiming ( 8, 0 );
	bullet2.SetAutoYaw ( );	
	
	var		enemy = new msw.Object ( eg );
	enemy.SetFrame ( "enemy.small" );
	enemy.SetAiming ( 2, 0 );
	enemy.SetAutoYaw ( );			
	enemy.AddSpawn ( bullet1,  0, 30, -1 );
	enemy.AddSpawn ( bullet2, 20, 30, -1 );
	
	var		stage = new msw.Object ( sg );
	stage.SetPos ( pos.x, pos.y );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawn ( enemy, 1, 80, -1 );	
	
	Game.AddStage ( stage, "Aiming Bullet2", "2 Different Speed Aiming Bullets." );
	
	//-------------------------------------------------------
	// Aiming Bullet (DDA)
	var		bullet = new msw.Object ( bg );
	bullet.SetFrame ( "projectile.blood" );
	bullet.SetAimingDDA ( 4, 0 );
	bullet.SetYaw ( 0.05 );				
	bullet.SetPos ( 0, -15 );

	// Enemy
	var		enemy = new msw.Object ( eg );
	enemy.SetFrame ( "enemy.small" );
	enemy.SetAimingDDA ( 2, 0 );
	enemy.SetAutoYaw ( );			
	enemy.AddSpawn ( bullet, 0, 30, -1 );	

	// Stage
	var		stage = new msw.Object ( sg );
	stage.SetPos ( pos.x, pos.y );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawn ( enemy, 1, 120, -1 );	

	Game.AddStage ( stage, "Aiming Bullet (DDA)", "Bullets with DDA move to main character." );	
	
	//==========================================================
	// Aiming Bullet (FPN)
	var		bullet = new msw.Object ( bg );
	bullet.SetFrame ( "projectile.blood" );
	bullet.SetAimingFPN ( 4, 0 );
	bullet.SetYaw ( 0.05 );					
	bullet.SetPos ( 0, -15 );

	// Enemy
	var		enemy = new msw.Object ( eg );
	enemy.SetFrame ( "enemy.small" );
	enemy.SetAimingFPN ( 2, 0 );
	enemy.SetAutoYaw ( );			
	enemy.AddSpawn ( bullet, 0, 30, -1 );	

	// Stage
	var		stage = new msw.Object ( sg );
	stage.SetPos ( pos.x, pos.y );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawn ( enemy, 1, 120, -1 );	
	
	Game.AddStage ( stage, "Aiming Bullet (FPN)", "Bullets with FP move to main character." );	

	//==========================================================
	// Directed Bullet
	var		bullet1 = new msw.Object ( bg );
	bullet1.SetFrame ( "projectile.blood" );
	bullet1.SetDirected ( 4, 0.30 );
	bullet1.SetYaw ( 0.05 );	

	var		bullet2 = new msw.Object ( bg );
	bullet2.SetFrame ( "projectile.blood.danger" );
	bullet2.SetDirected ( 4, -0.30 );
	bullet2.SetYaw ( 0.05 );	

	var		enemy = new msw.Object ( eg );
	enemy.SetFrame ( "enemy.small" );
	enemy.SetDirected ( 2.0, 0.40 );
	enemy.SetAutoYaw ( );			
	enemy.AddSpawn ( bullet1,  0, 15, -1 );
	enemy.AddSpawn ( bullet2,  0, 15, -1 );

	var		stage = new msw.Object ( sg );
	stage.SetPos ( msw.MARGIN - msw.DEADZONE * 0.5, pos.y - msw.DEADZONE * 0.5 );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawn ( enemy, 0, 80, -1 );	
	
	Game.AddStage ( stage, "Directed Bullet", "Bullets move to aimed direction." );
	
	//==========================================================
	// Directed Bullet With Table
	var		bullet1 = new msw.Object ( bg );
	bullet1.SetFrame ( "projectile.blood" );
	bullet1.SetDirected16_30 ( 4, 0.30 );
	bullet1.SetYaw ( 0.05 );	
	
	var		bullet2 = new msw.Object ( bg );
	bullet2.SetFrame ( "projectile.blood.danger" );
	bullet2.SetDirected16_30 ( 4, -0.30 );
	bullet2.SetYaw ( 0.05 );	
	
	var		enemy = new msw.Object ( eg );
	enemy.SetFrame ( "enemy.small" );
	enemy.SetDirected16_30 ( 20, 0.40 );
	enemy.SetAutoYaw ( );			
	enemy.AddSpawn ( bullet1,  0, 15, -1 );
	enemy.AddSpawn ( bullet2,  0, 15, -1 );	
	
	var		stage = new msw.Object ( sg );
	stage.SetPos ( msw.MARGIN - msw.DEADZONE * 0.5, pos.y - msw.DEADZONE * 0.5 );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawn ( enemy, 0, 80, -1 );	
	
	Game.AddStage ( stage, "Directed Bullet With Table", "16 Way, Speed 30 Using Table." );

	//==========================================================
	// Directed Bullet (DDA)
	var		bullet1 = new msw.Object ( bg );
	bullet1.SetFrame ( "projectile.blood" );
	bullet1.SetDirectedDDA ( 4, 0.30 );
	bullet1.SetYaw ( 0.05 );	

	var		bullet2 = new msw.Object ( bg );
	bullet2.SetFrame ( "projectile.blood.danger" );
	bullet2.SetDirectedDDA ( 4, -0.30 );
	bullet2.SetYaw ( 0.05 );	

	var		enemy = new msw.Object ( eg );
	enemy.SetFrame ( "enemy.small" );
	enemy.SetDirectedDDA ( 2.0, 0.40 );
	enemy.SetAutoYaw ( );			
	enemy.AddSpawn ( bullet1,  0, 15, -1 );
	enemy.AddSpawn ( bullet2,  0, 15, -1 );

	var		stage = new msw.Object ( sg );
	stage.SetPos ( msw.MARGIN - msw.DEADZONE * 0.5, pos.y - msw.DEADZONE * 0.5 );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawn ( enemy, 0, 80, -1 );	

//	Game.AddStage ( stage, "Directed Bullet (DDA)", "Bullets with DDA move to aimed direction." );
	
	
	//==========================================================
	// N-Way Bullets
	var		bullet1 = new msw.Object ( bg );
	bullet1.SetFrame ( "projectile.chaingun" );
	bullet1.SetDirected ( 3, 0.5 );
	bullet1.SetAutoYaw ( );		

	var		bullet2 = new msw.Object ( bg );
	bullet2.SetFrame ( "projectile.machinegun" );
	bullet2.SetDirected ( 3, 0.5 );
	bullet2.SetAutoYaw ( );	

	var		stage = new msw.Object ( sg );
	stage.SetPos ( pos.x, pos.y );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawnNWay ( bullet1,  0, 40, -1, 31, 0.01 );
	stage.AddSpawnNWay ( bullet2, 20, 40, -1, 32, 0.01 );	

	Game.AddStage ( stage, "N-Way Bullets", "Bullets spread fanwisely." );

	//==========================================================
	// Circle Bullets
	var		bullet1 = new msw.Object ( bg );
	bullet1.SetFrame ( "projectile.chaingun" );
	bullet1.SetDirected ( 3, 0.5 );
	bullet1.SetAutoYaw ( );		

	var		bullet2 = new msw.Object ( bg );
	bullet2.SetFrame ( "projectile.machinegun" );
	bullet2.SetDirected ( 3, 0.5 );
	bullet2.SetAutoYaw ( );	
	
	var		stage = new msw.Object ( sg );
	stage.SetPos ( pos.x, cc.winSize.height / 2 + 100 );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawnCircle ( bullet1,  0, 40, -1, 80, false );
	stage.AddSpawnCircle ( bullet2, 20, 40, -1, 80, true  );		

	Game.AddStage ( stage, "Circle Bullets", "Bullets spread circlely." );
	
	//==========================================================
	// Fission Bullet
	var		bullet1 = new msw.Object ( bg );
	bullet1.SetFrame ( "projectile.chaingun" );
	bullet1.SetDirected ( 3, 0 );
	bullet1.SetAutoYaw ( );		
	
	var		bullet2 = new msw.Object ( bg );
	bullet2.SetFrame ( "projectile.machinegun" );
	bullet2.SetDirected ( 5, 0 );
	bullet2.SetAutoYaw ( 0 );	
	
	var		bullet3 = new msw.Object ( bg );
	bullet3.SetFrame ( "projectile.chaingun" );
	bullet3.SetDirected ( 3, 0.5 );
	bullet3.SetAutoYaw ( 0.01 );
	bullet3.SetScale ( 3, 1, 0, 0 ); 
	bullet3.AddSpawnNWay ( bullet1, 80, 0, 1, 7, 0.02 );
	bullet3.SetNext ( null, 81 );

	var		bullet4 = new msw.Object ( bg );
	bullet4.SetFrame ( "projectile.machinegun" );
	bullet4.SetDirected ( 3, 0.5 );
	bullet4.SetAutoYaw ( 0.01 );
	bullet4.SetScale ( 3, 1, 0, 0 ); 
	bullet4.AddSpawnNWay ( bullet2, 80, 0, 1, 8, 0.02 );
	bullet4.SetNext ( null, 81 );
	
	var		stage = new msw.Object ( sg );
	stage.SetPos ( pos.x, pos.y );
	stage.AddSpawn ( Game.Player, 0, 0, 1 );
	stage.AddSpawn ( bullet3,   0, 40, -1 );
	stage.AddSpawn ( bullet4,  20, 40, -1 );

	Game.AddStage ( stage, "Fission Bullet", "Bullet will be divided." );
};
