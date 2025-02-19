
@bot.command()
async def serverinfo(ctx):
    guild = ctx.guild

    print(f"Fetching information for server: {guild.name} (ID: {guild.id})")
    
    embed = discord.Embed(
        title=f"Server Information - {guild.name}",
        color=discord.Color.blue(),
        timestamp=ctx.message.created_at
    )
    
    # Print guild details
    print(f"Guild owner: {guild.owner.mention if guild.owner else 'Unknown'}")
    print(f"Total members: {guild.member_count}")
    
    # Set the server's icon if available
    if guild.icon:
        print(f"Guild icon URL: {guild.icon.url}")
    else:
        print("No guild icon available.")
    
    embed.set_thumbnail(url=guild.icon.url if guild.icon else None)
    
    # Add basic server fields
    embed.add_field(name="Server ID", value=guild.id, inline=True)
    embed.add_field(name="Owner", value=guild.owner.mention if guild.owner else "Unknown", inline=True)
    embed.add_field(name="Total Members", value=guild.member_count, inline=True)
    
    # Count and display bot members
    bot_count = sum(1 for member in guild.members if member.bot)
    print(f"Total bots: {bot_count}")
    embed.add_field(name="Bots", value=bot_count, inline=True)

    # Display number of roles and channels
    embed.add_field(name="Roles", value=len(guild.roles), inline=True)
    embed.add_field(name="Channels", value=len(guild.channels), inline=True)

    # Display boost information
    embed.add_field(name="Boost Level", value=guild.premium_tier, inline=True)
    embed.add_field(name="Boosters", value=guild.premium_subscription_count, inline=True)
    
    # Display verification level and server creation date
    embed.add_field(name="Verification Level", value=str(guild.verification_level), inline=True)
    embed.add_field(name="Created On", value=guild.created_at.strftime("%Y-%m-%d %H:%M:%S"), inline=True)
    
    print(f"Server verification level: {guild.verification_level}")
    print(f"Server created on: {guild.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Send the embed with server info to the channel
    await ctx.send(embed=embed)
    
    print("Server information sent successfully.")
    
