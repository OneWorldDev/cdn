@bot.command()
async def serverinfo(ctx):
    guild = ctx.guild

    embed = discord.Embed(
        title=f"Server Information - {guild.name}",
        color=discord.Color.blue(),
        timestamp=ctx.message.created_at
    )
    
    embed.set_thumbnail(url=guild.icon.url if guild.icon else None)
    
    embed.add_field(name="Server ID", value=guild.id, inline=True)
    embed.add_field(name="Owner", value=guild.owner.mention if guild.owner else "Unknown", inline=True)
    embed.add_field(name="Total Members", value=guild.member_count, inline=True)
    
    bot_count = sum(1 for member in guild.members if member.bot)
    embed.add_field(name="Bots", value=bot_count, inline=True)

    embed.add_field(name="Roles", value=len(guild.roles), inline=True)
    embed.add_field(name="Channels", value=len(guild.channels), inline=True)

    embed.add_field(name="Boost Level", value=guild.premium_tier, inline=True)
    embed.add_field(name="Boosters", value=guild.premium_subscription_count, inline=True)
    
    embed.add_field(name="Verification Level", value=str(guild.verification_level), inline=True)
    embed.add_field(name="Created On", value=guild.created_at.strftime("%Y-%m-%d %H:%M:%S"), inline=True)
    
    await ctx.send(embed=embed)
